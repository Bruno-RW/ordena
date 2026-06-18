# Fluxograma

````mermaid
        flowchart TD
        A([Acessa o Ordena]) --> B

        B[Dashboard\nResumo geral + carga semanal]

        B --> C[Disciplinas]
        B --> D[Tarefas]
        B --> E[Calendário]
        B --> F[Desempenho]
        B --> G[Perfil]

        C --> C1[Adicionar disciplina\nnome, professor, horário]
        C1 --> C2[Editar / Excluir\nDialog de confirmação]

        D --> D1[Adicionar tarefa\ntítulo, disciplina, prazo]
        D1 --> D2[Concluir / Excluir\ncheckbox + status]
        D --> D3[Filtrar\npor disciplina ou status]

        E --> E1[Alternar visão\nmensal ou semanal]
        E1 --> E2[Clicar evento\ndetalhe da tarefa]

        F --> F1[Registrar nota\npor disciplina]
        F1 --> F2[Ver evolução\ngráfico por semestre]

        G --> G1[Editar dados\nnome e curso]
        G --> G2[Tema claro/escuro\ntoggle]

        C2 -.->|sidebar| B
        D2 -.->|sidebar| B
        E2 -.->|sidebar| B
        F2 -.->|sidebar| B
        G2 -.->|sidebar| B

        style B fill:#EEEDFE,stroke:#534AB7,color:#26215C
        style C fill:#E1F5EE,stroke:#0F6E56,color:#04342C
        style D fill:#E1F5EE,stroke:#0F6E56,color:#04342C
        style E fill:#FAEEDA,stroke:#854F0B,color:#412402
        style F fill:#E6F1FB,stroke:#185FA5,color:#042C53
        style G fill:#F1EFE8,stroke:#5F5E5A,color:#2C2C2A
        ```
````
