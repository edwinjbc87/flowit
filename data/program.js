module.exports = {
    "main": "Program",
    "modules": [
        {
            "name": "Program",
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
                    "order": 4,
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
                        "value": "1"
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
                        "value": "5"
                    },
                    "level": 0
                },
                {
                    "id": 4,
                    "order": 3,
                    "name": "Imprimir resultado",
                    "type": "output",
                    "expression": {
                        "operation": "sum",
                        "left": {
                            "operator": "variable",
                            "left": "a"
                        },
                        "right": {
                            "operator": "variable",
                            "left": "b"
                        }
                    },
                    "level": 0
                }
            ]
        }
    ]
}