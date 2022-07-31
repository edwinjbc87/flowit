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
                    "order": 6,
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
                        "type": "number",
                        "name": "a",
                        "value": "0"
                    },
                    "level": 0
                },
                {
                    "id": 3,
                    "order": 2,
                    "name": "Declarar b",
                    "type": "declaration",
                    "variable": {
                        "type": "number",
                        "name": "b",
                        "value": "0"
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
                    "level": 0
                }
            ]
        }
    ]
}