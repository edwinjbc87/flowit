module.exports = {
    "main": "Programa",
    "modules": [
        {
            "name": "Programa",
            "type": "program",
            "operations": [
                {
                    "id": 0,
                    "order": 0,
                    "name": "Inicio",
                    "type": "start",
                    "level": 0
                },
                {
                    "id": 1,
                    "order": 7,
                    "name": "Fin",
                    "type": "end",
                    "level": 0
                },
                {
                    "id": 2,
                    "order": 1,
                    "name": "Declarar a",
                    "type": "declaration",
                    "variable": {
                        "type": "integer",
                        "name": "a",
                        "value": {
                            "operation": "value",
                            "left": 0
                        }
                    },
                    "level": 0
                },
                {
                    "id": 3,
                    "order": 2,
                    "name": "Declarar b",
                    "type": "declaration",
                    "variable": {
                        "type": "integer",
                        "name": "b",
                        "value": {
                            "operation": "value",
                            "left": 0
                        }
                    },
                    "level": 0
                },
                {
                    "id": 4,
                    "order": 3,
                    "name": "Leer a",
                    "type": "input",
                    "message": "Ingrese el valor de a",
                    "variable": "a",
                    "level": 0
                },
                {
                    "id": 5,
                    "order": 4,
                    "name": "Leer b",
                    "type": "input",
                    "message": "Ingrese el valor de b",
                    "variable": "b",
                    "level": 0
                },
                {
                    "id": 6,
                    "order": 5,
                    "name": "Imprimir suma",
                    "type": "output",
                    "expression": {
                        "operation": "concat",
                        "left": {
                            "operation": "value",
                            "left": "Suma: "
                        },
                        "right": {
                            "operation": "sum",
                            "left": {
                                "operation": "variable",
                                "left": "a"
                            },
                            "right": {
                                "operation": "variable",
                                "left": "b"
                            }
                        }
                    },
                    "level": 0
                },
                {
                    "id": 7,
                    "order": 6,
                    "name": "Si es mayor a 10",
                    "type": "condition",
                    "condition": {
                        "operation": "gt",
                        "left": {
                            "operation": "sum",
                            "left": {
                                "operation": "variable",
                                "left": "a"
                            },
                            "right": {
                                "operation": "variable",
                                "left": "b"
                            }
                        },
                        "right": {
                            "operation": "value",
                            "left": 10
                        }
                    },
                    "level": 0,
                },
                {
                    "id": 8,
                    "order": 0,
                    "name": "Imprimir si es mayor a 10",
                    "type": "output",
                    "expression": {
                        "operation": "concat",
                        "left": {
                            "operation": "value",
                            "left": "Si es mayor a 10: "
                        },
                        "right": {
                            "operation": "sum",
                            "left": {
                                "operation": "variable",
                                "left": "a"
                            },
                            "right": {
                                "operation": "variable",
                                "left": "b"
                            }
                        }
                    },
                    "level": 1,
                    "parent": "7_yes"
                },
                {
                    "id": 9,
                    "order": 0,
                    "name": "Imprimir es menor o igual a 10",
                    "type": "output",
                    "expression": {
                        "operation": "concat",
                        "left": {
                            "operation": "value",
                            "left": "Es menor o igual a 10: "
                        },
                        "right": {
                            "operation": "sum",
                            "left": {
                                "operation": "variable",
                                "left": "a"
                            },
                            "right": {
                                "operation": "variable",
                                "left": "b"
                            }
                        }
                    },
                    "level": 1,
                    "parent": "7_no"
                }
            ]
        }
    ]
}