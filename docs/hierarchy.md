# Hierarquia de Funcionalidades

````mermaid
    flowchart TD
    ROOT["Ordena\nPlataforma acadêmica"]

    ROOT --> SEC1[Disciplinas]
    ROOT --> SEC2[Tarefas]
    ROOT --> SEC3[Calendário]
    ROOT --> SEC4[Desempenho]
    ROOT --> SEC5[Perfil]

    SEC1 --> E1A[Nome / Professor]
    SEC1 --> E1B[Horário / Sala]
    SEC2 --> E2A[Título]
    SEC2 --> E2B[Prazo]
    SEC2 --> E2C[Status]
    SEC3 --> E3A[Eventos]
    SEC3 --> E3B[Prazos]
    SEC4 --> E4A[Notas]
    SEC4 --> E4B[Médias]
    SEC5 --> E5A[Nome / Curso]
    SEC5 --> E5B[Tema]

    E1A --> A1["Criar · Editar · Excluir"]
    E1B --> A1
    E2A --> A2["Criar · Concluir · Filtrar"]
    E2B --> A2
    E2C --> A2
    E3A --> A3["Visualizar · Alternar"]
    E3B --> A3
    E4A --> A4["Registrar · Consultar"]
    E4B --> A4
    E5A --> A5["Editar · Alternar tema"]
    E5B --> A5

    style ROOT fill:#EEEDFE,stroke:#534AB7,color:#26215C
    style SEC1 fill:#E1F5EE,stroke:#0F6E56,color:#04342C
    style SEC2 fill:#E1F5EE,stroke:#0F6E56,color:#04342C
    style SEC3 fill:#FAEEDA,stroke:#854F0B,color:#412402
    style SEC4 fill:#E6F1FB,stroke:#185FA5,color:#042C53
    style SEC5 fill:#F1EFE8,stroke:#5F5E5A,color:#2C2C2A
    ```
````
