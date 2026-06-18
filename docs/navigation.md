# Navegação

````mermaid
    flowchart LR
        SB["Sidebar\nnavegação global"]

        SB <--> PG1[Dashboard\nTela inicial]
        SB <--> PG2[Disciplinas\nSemestre atual]
        SB <--> PG3[Tarefas\nLista + filtros]
        SB <--> PG4[Calendário\nMensal / semanal]
        SB <--> PG5[Desempenho\nNotas e gráficos]
        SB <--> PG6[Perfil\nConfigurações]

        PG2 -->|vincula| PG3
        PG3 -.->|ver prazo| PG4
        PG2 -.->|ver notas| PG5

        style SB fill:#F1EFE8,stroke:#5F5E5A,color:#2C2C2A
        style PG1 fill:#EEEDFE,stroke:#534AB7,color:#26215C
        style PG2 fill:#E1F5EE,stroke:#0F6E56,color:#04342C
        style PG3 fill:#E1F5EE,stroke:#0F6E56,color:#04342C
        style PG4 fill:#FAEEDA,stroke:#854F0B,color:#412402
        style PG5 fill:#E6F1FB,stroke:#185FA5,color:#042C53
        style PG6 fill:#F1EFE8,stroke:#5F5E5A,color:#2C2C2A
        ```
````
