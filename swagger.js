module.exports = {
  openapi: "3.0.0",
  info: {
    title: "OZmap Testing API",
    description: "API gerenciador de usuários e localizações.",
    version: "1.0.0",
    contact: {
      email: "celobsilveira@gmail.com"
    }
  },
  paths: {
    "/users/list-all": {
      get: {
        tags: ["Users"],
        summary: "Lista todos os usuários",
        description: "Lista todos os usuários cadastrados no sistema.",
        produces: ["application/json"],
        responses: {
          200: {
            description: "A lista de usuários foi obtida com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/User"
                  }
                },
                example: 
                  {
                    "users": [
                        {
                            "_id": "662332ebd8bc107b448ff3c3",
                            "name": "Usuário Teste 1",
                            "email": "usuario.teste1@gmail.com",
                            "address": "Avenida Assis Brasil 1500",
                            "coordinates": [
                                -51.1711621,
                                -30.0092174
                            ],
                            "__v": 0
                        },
                        {
                            "_id": "662334a6d8bc107b448ff3d4",
                            "name": "Usuário Teste 2",
                            "email": "usuario.teste2@gmail.com",
                            "address": "Avenida Azenha 155",
                            "coordinates": [
                                -51.214457,
                                -30.04521279999999
                            ],
                            "__v": 0
                        }
                    ],
                    "message": "Usuários listados com sucesso."
                }
              }
            }
          },
          404: {
            description: "Nenhum usuário encontrado."
          }
        }
      },
    },
    "/users/list-user/:id": {
      get: {
        tags: ["Users"],
        summary: "Lista um usuário existente.",
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "string"
            },
            required: true,
            description: "ID do usuário"
          }
        ],
        description: "Lista um usuário cadastrado no sistema.",
        produces: ["application/json"],
        responses: {
          200: {
            description: "A lista de usuário foi obtida com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/User"
                  }
                },
                example: {
                  "user": {
                      "_id": "66232fd41b30293ed0ef2fe9",
                      "name": "Marcelo Batista Silveira",
                      "email": "marcelo@gmail.com",
                      "address": "Rua Tronca 20",
                      "coordinates": [
                          -51.1604678,
                          -29.1738143
                      ],
                      "__v": 0
                  },
                  "message": "Usuário listado com sucesso."
                }
            }
            },
          },  
          404: {
            description: "Nenhum usuário encontrado."
          }
        }
      },
    },    
    "/users/create": {
      post: {
        tags: ["Users"],
        summary: "Cria um novo usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User"
              },
              example: {
                "name": "Usuário Teste 3",
                "email": "usuario.teste3@gmail.com",
                "address": "Rua Dezoito do Forte 100"
              }
            }
          }
        },
        responses: {
          200: {
            description: "O usuário foi criado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User"
                },
                example: 
                  {
                    "user": {
                        "name": "Usuário Teste 3",
                        "email": "usuario.teste3@gmail.com",
                        "address": "Rua Dezoito do Forte 100",
                        "coordinates": [
                            -51.1625114,
                            -29.16975589999999
                        ],
                        "_id": "662343b0ca55735ea0ead33c",
                        "__v": 0
                    },
                    "message": "Usuário criado com sucesso."
                  }
              }
            }
          },
          400: {
            description: "Houve um erro ao criar o usuário."
          }
        }
      },
    },
    "/users/update/:id": {
      put: {
        tags: ["Users"],
        summary: "Atualiza um usuário existente",
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "string"
            },
            required: true,
            description: "ID do usuário"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User"
              },
              example:
                {
                  name: "Novo nome do usuário",
                  email: "novoemail@usuario.com",
                  address: "Novo endereço do usuário"
                }
            }
          }
        },
        responses: {
          200: {
            description: "O usuário foi atualizado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User"
                },
                example: 
                {
                  "userUpdate": {
                      "_id": "662314fa1809343a11f45380",
                      "name": "Novo nome do usuário",
                      "email": "usuario_novo_email_atualizado@gmail.com",
                      "address": "Novo endereço do usuário Atualizado",
                      "coordinates": [
                          -51.1432984,
                          -29.7641102
                      ],
                      "__v": 0
                  },
                  "message": "Usuário atualizado com sucesso."
                }                
              }
            }
          },
          400: {
            description: "ID de usuário inválido ou erro ao atualizar o usuário."
          },
          404: {
            description: "Usuário não encontrado."
          }
        }
      },
    },
    "/users/delete/:id": {
      delete: {
        tags: ["Users"],
        summary: "Remove um usuário existente",
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "string"
            },
            required: true,
            description: "ID do usuário"
          }
        ],
        responses: {
          200: {
            description: "O usuário foi deletado com sucesso."
          },
          400: {
            description: "ID de usuário inválido."
          },
          404: {
            description: "Usuário não encontrado."
          }
        }
      }
    },
    "/users/export": {
      get: {
        tags: ["Users"],
        summary: "Exporta a lista de todos os usuários para um arquivo CSV, o download é iniciado automaticamente.",
        responses: {
          200: {
            description: "A lista de usuários foi exportada com sucesso.",
            content: {
              "text/csv": {
                schema: {
                  type: "string",
                  format: "binary"
                }
              }
            }
          }
        }
      }
    },
    "/regions/create": {
      post: {
        tags: ["Regions"],
        summary: "Cria uma nova região",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Region"
              },
              example: {
                "name": "Zona Norte de Porto Alegre",
                "coordinates": [
                    -51.1711621,
                    -30.0092174
                ],
                "owner": "662332ebd8bc107b448ff3c3"
            }
            }
          }
        },
        responses: {
          200: {
            description: "A região foi criada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Region",
                }, 
                example: {
                  "name": "Zona Norte de Porto Alegre",
                  "coordinates": [
                      -51.1711621,
                      -30.0092174
                  ],
                  "owner": "662332ebd8bc107b448ff3c3",
                  "_id": "66233340d8bc107b448ff3c7",
                  "__v": 0
                }
              }
            }
          },
          400: {
            description: "Houve um erro ao criar a região."
          }
        }
      },
    },
    "/regions/list-all": {
      get: {
        tags: ["Regions"],
        summary: "Lista todas as regiões",
        responses: {
          200: {
            description: "A lista de regiões foi obtida com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Region"
                  }
                },
                example: [
                  {
                      "_id": "662330f8ffdb564235e298c7",
                      "name": "Centro de São Leopoldo",
                      "coordinates": [
                          -51.1432984,
                          -29.7641102
                      ],
                      "owner": "66232fd41b30293ed0ef2fe9",
                      "__v": 0
                  },
                  {
                      "_id": "66233340d8bc107b448ff3c7",
                      "name": "Zona Norte de Porto Alegre",
                      "coordinates": [
                          -51.1711621,
                          -30.0092174
                      ],
                      "owner": "662332ebd8bc107b448ff3c3",
                      "__v": 0
                  },
                  {
                      "_id": "66234a3fcad534598710d268",
                      "name": "Centro de Porto Alegre",
                      "coordinates": [
                          -51.214457,
                          -30.04521279999999
                      ],
                      "owner": "662334a6d8bc107b448ff3d4",
                      "__v": 0
                  }
                ]
              }
            }
          },
          404: {
            description: "Nenhuma região encontrada."
          }
        }
      },
    },
    "/regions/list-region/:id": {
      get: {
        tags: ["Regions"],
        summary: "Lista somente uma região.",
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "string"
            },
            required: true,
            description: "ID da região"
          }
        ],        
        responses: {
          200: {
            description: "Uma região foi obtida com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Region"
                  }
                },
                example: [
                  {
                    "region": {
                        "_id": "66234799d24fc0c574cfa888",
                        "name": "Zona Norte de Porto Alegre",
                        "coordinates": [
                            -51.1711621,
                            -30.0092174
                        ],
                        "owner": "662332ebd8bc107b448ff3c3",
                        "__v": 0
                    },
                    "message": "Região listada com sucesso."
                  }
                ]
              }
            }
          },
          404: {
            description: "Nenhuma região encontrada."
          }
        }
      },
    },    
    "/regions/update/:id": {
      put: {
        tags: ["Regions"],
        summary: "Atualiza uma região existente",
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "string"
            },
            required: true,
            description: "ID da região"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Region"
              },
              example: {
                "name": "Nova Região Teste",
                "coordinates": [
                  -51.1711621, 
                  -30.0092174
                ],
                "owner": "662332ebd8bc107b448ff3c3"
              }
            }
          }
        },
        responses: {
          200: {
            description: "A região foi atualizada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Region"
                },
                example: {
                  "region": {
                      "_id": "66231a43ca409cdf4a26d641",
                      "name": "Nova Região Teste Atualizada",
                      "coordinates": [
                        -51.1711621, 
                        -30.0092174
                      ],
                      "owner": "662314fa1809343a11f45380",
                      "__v": 0
                  },
                  "message": "Região atualizada com sucesso."
                }
              }
            }
          },
          400: {
            description: "ID de região inválido ou erro ao atualizar a região."
          },
          404: {
            description: "Região não encontrada."
          }
        }
      },
    },
    "/regions/delete/:id": {
      delete: {
        tags: ["Regions"],
        summary: "Remove uma região existente",
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "string"
            },
            required: true,
            description: "ID da região"
          }
        ],
        responses: {
          200: {
            description: "A região foi deletada com sucesso."
          },
          400: {
            description: "ID de região inválido."
          },
          404: {
            description: "Região não encontrada."
          }
        }
      }
    },
    "/regions/list-by-point": {
      post: {
        tags: ["Regions"],
        summary: "Lista regiões por ponto",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  coordinates: {
                    type: "array",
                    items: {
                      type: "number"
                    }
                  }
                }
              },
              example: {
                "coordinates": [
                    -51.214457,
                    -30.04521279999999
                ]
              }
            }
          }
        },
        responses: {
          200: {
            description: "As regiões foram listadas com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Region"
                  }, 
                  example: {
                    "address": "Av. da Azenha, 155 - Azenha, Porto Alegre - RS, 90160-000, Brazil",
                    "regions": [
                        {
                            "_id": "66234a3fcad534598710d268",
                            "name": "Centro de Porto Alegre",
                            "coordinates": [
                                -51.214457,
                                -30.04521279999999
                            ],
                            "owner": "662334a6d8bc107b448ff3d4",
                            "__v": 0
                        }
                    ]
                  }
                }
              }
            }
          },
          400: {
            description: "Coordenadas inválidas."
          }
        }
      },
    },
    "/regions/list-by-distance": {
      post: {
        tags: ["Regions"],
        summary: "Lista regiões por distância",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  coordinates: {
                    type: "array",
                    items: {
                      type: "number"
                    }
                  },
                  distance: {
                    type: "number"
                  },
                  user: {
                    type: "string"
                  },
                  filterUser: {
                    type: "boolean"
                  }
                }
              },
              example: {
                "coordinates": [
                    -51.214457,
                    -30.04521279999999
                ],
                "distance": 10000,
                "filterUser": true,
                "user": "662332ebd8bc107b448ff3c3"
              }
            }
          }
        },
        responses: {
          200: {
            description: "As regiões foram listadas com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Region"
                  },
                  example: [
                    {
                      "_id": "66233340d8bc107b448ff3c7",
                      "name": "Zona Norte de Porto Alegre",
                      "coordinates": [
                          -51.1711621,
                          -30.0092174
                      ],
                      "owner": "662332ebd8bc107b448ff3c3",
                      "__v": 0
                    }
                  ]
                }
              }
            }
          },
          400: {
            description: "Coordenadas inválidas ou distância inválida."
          }
        }
      },
    },
    "/regions/export": {
      get: {
        tags: ["Regions"],
        summary: "Exporta a lista de todos as regiões para um arquivo CSV, o download é iniciado automaticamente.",
        responses: {
          200: {
            description: "A lista de usuários foi exportada com sucesso.",
            content: {
              "text/csv": {
                schema: {
                  type: "string",
                  format: "binary"
                }
              }
            }
          }
        }
      }
    },        
  },
  components: {
    schemas: {
      User: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: {
            type: "string",
            description: "O nome do usuário."
          },
          email: {
            type: "string",
            description: "O email do usuário."
          },
          address: {
            type: "string",
            description: "O endereço do usuário."
          },
          coordinates: {
            type: "array",
            items: {
              type: "number"
            },
            description: "As coordenadas do usuário."
          }
        },
        example: {
          name: "Nome do usuário",
          email: "email@usuario.com",
          address: "Endereço do usuário",
          coordinates: [-51.1711621, -30.0092174]
        }
      },
      Region: {
        type: "object",
        required: ["name", "coordinates", "owner"],
        properties: {
          name: {
            type: "string",
            description: "O nome da região."
          },
          coordinates: {
            type: "array",
            items: {
              type: "number"
            },
            description: "As coordenadas da região."
          },
          owner: {
            type: "string",
            description: "O ID do usuário proprietário da região."
          }
        },
        example: {
          name: "Nome da região",
          coordinates: [-51.1711621, -30.0092174],
          owner: "662332ebd8bc107b448ff3c3"
        }
      }      
    }
  }
};