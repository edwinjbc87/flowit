module.exports = {
    "main": "Programa",
    "modules": [
        {
            "name": "Programa",
            "type": "program",
            "operations": [
                {
                    "id": 0,
                    "name": "Inicio",
                    "type": "start",
                    "level": 0
                },
                {
                    "id": 2,
                    "name": "Declarar a",
                    "type": "declaration",
                    "variable": {
                        "type": "integer",
                        "name": "a",
                        "value": 0
                    },
                    "level": 0
                },
                {
                    "id": 3,
                    "name": "Declarar b",
                    "type": "declaration",
                    "variable": {
                        "type": "integer",
                        "name": "b",
                        "value": 0
                    },
                    "level": 0
                },
                {
                    "id": 4,
                    "name": "Leer a",
                    "type": "input",
                    "message": "Ingrese el valor de a",
                    "variable": "a",
                    "level": 0
                },
                {
                    "id": 5,
                    "name": "Leer b",
                    "type": "input",
                    "message": "Ingrese el valor de b",
                    "variable": "b",
                    "level": 0
                },
                {
                    "id": 9,
                    "name": "Imprimir es menor o igual a 10",
                    "type": "output",
                    "expression": {
                        "operation": "concat",
                        "params": ["Es menor o igual a 10: ",
                            {
                                "operation": "sum",
                                "params": [
                                    {
                                        "operation": "var",
                                        "params": ["a"]
                                    },
                                    {
                                        "operation": "var",
                                        "params": ["b"]
                                    }
                                ]
                            }
                        ]
                    },
                    "level": 0
                },
                {
                    "id": 1,
                    "name": "Fin",
                    "type": "end",
                    "level": 0
                }
            ]
        }
    ]
}