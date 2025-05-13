// 数据库内容定义 - 存储不同利益相关者类别的信息，用于展示给用户
const DATABASE_CONTENT = {
    // 公共事业和私人基础设施提供商
    "database_a": {
        "title": " Public Utilities & Private Infrastructure Providers",
        "sf": ["San Francisco Public Utilities Commission (SFPUC)"],
        "accra": [
            "Community Water and Sanitation Agency (CWSA)",
            "Ghana Water Company",
            "WRC"
        ]
    },
    // 政策制定者和监管者
    "database_b": {
        "title": "Policy-makers & Regulators",
        "sf": [
            "California Water Environment Association (CWEA)",
            "California Department of Water Resources (DWR)"
        ],
        "accra": [
            "Public Utility Regulatory Commission (PURC)",
            "Ministry of Sanitation and Water Resources",
            "EPA"
        ]
    },
    // 创新者和企业家
    "database_c": {
        "title": " Innovators & Entrepreneurs",
        "sf": ["Epic Cleantec", "Fluid Analytics"],
        "accra": ["Pure Home Water", "Waterbits"]
    },
    // 投资者和加速器
    "database_d": {
        "title": " Investors & Accelerators",
        "sf": ["Imagine H20", "Echo River Capital"],
        "accra": []
    },
    // 支持性利益相关者（如非政府组织、学术界、公民）
    "database_e": {
        "title": " Supporting Stakeholders",
        "subtitle": "e.g. NGOs, Academia, Citizens",
        "sf": ["Stanford University", "UC Berkeley", "Pacific Inst."],
        "accra": [
            "University of Ghana",
            "CSIR",
            "KNUST",
            "WaterAid",
            "UNICEF",
            "CONIWAS GBDA",
            "NASPWP"
        ]
    },
    // 内部级治理促成者 - 支持新政策和法规的实体
    "database_f": {
        "title": "Intra-level Governance enablers",
        "sf": [
            "Address regulatory barriers and launch new policies that support new technologies and their procurement processes",
            "Utilities to support and promote the new policies"
        ],
        "accra": [
            "Strengthening governance and policy enforcement",
            "Developing a stable regulatory framework",
            "Adopting transparent procurement practices",
            "Fostering public-private partnerships for resource mobilisation"
        ]
    },
    // 内部级水创业促成者 - 支持水领域创新的实体
    "database_g": {
        "title": "Intra-level Aquapreneurship enablers",
        "sf": [
            "Non-dilutive pilot funding",
            "Start-ups/innovators to improve storytelling and marketing capabilities to attract more attention and resources",
            "Have international presence (e.g., Asia, India) to understand market dynamics and provide tailored support to startups"
        ],
        "accra": ["Incentivising employee innovation and creativity (if through piloting)"]
    },
    // 跨级个人促成者 - 支持个人层面水资源管理的实体
    "database_h": {
        "title": " Trans-level Individual enablers",
        "sf": [
            "Bring practitioners and innovators together with clear & supported procurement processes",
            "Address regulatory barriers and launch new policies that support new technologies and their procurement processes",
            "New ways of doing business",
            "Utilities to provide a trial-basis to showcase that things work before moving to the next stages",
            "Advocate for innovation-friendly policies for water start-ups",
            "Foster private-public partnerships"
        ],
        "accra": [
            "Adopting transparent procurement practices",
            "Strong leadership commitment to innovation",
            "Incentivising employee innovation and creativity (if through piloting)",
            "Providing financial incentives for smart water technologies",
            "Fostering public-private partnerships for resource mobilisation",
            "Conducting training for staff"
        ]
    },
    // 跨级多方利益相关者促成者 - 支持多方合作的实体
    "database_j": {
        "title": " Trans-level Multistakeholder enablers",
        "sf": [
            "Utilities/suppliers to feel responsibility to enable transformation",
            "Follow an streamlined process that requires a well-structured organisation",
            "Be proactive instead of reactive, which requires time spent to set a certain programme",
            "AI to foster and standardise decision-making (from C to others)",
            "Have a systemic view/understanding and a decision-support tools that links similar problems/issues together and studies the trade-offs between different habitats and technologies",
            "Involve non-governmental actors (private sector, academia, NGOs, etc.) to enhance collaboration and foster innovation",
            "Politicians that support innovation and see it as part of their legacy",
            "Modulation and standardisation to reduce costs and ease processes",
            "Plan for the long-term view and have individuals who aim to gain visibility outside their immediate environment",
            "Provide better data to inform decision-making and guide technology development",
            "Improve public perception and storytelling about water as a critical, high-priority issue",
            "Different rates for water consumption depending on the activity (higher rates for industrial use vs residential use)"
        ],
        "accra": [
            "Utilising digital tools and data for monitoring performance",
            "Implementing change management with early stakeholder engagement (in the context of utilities)",
            "Enhancing inter-agency and cross-sector collaboration",
            "Collaborating with international experts and institutions",
            "Ensuring access to dedicated funding for water innovation projects",
            "Investing in critical infrastructure upgrades",
            "Streamlining approval processes for water projects",
            "Establishing robust performance and feedback loops",
            "Focusing on sustainability in all operational practices",
            "Promoting a culture of continuous improvement and innovation",
            "Facilitating knowledge sharing across stakeholders",
            "Leveraging policy incentives to drive technology adoption",
            "Encouraging data-driven decision-making in water management",
            "Creating platforms for multi-stakeholder dialogue",
            "Fostering innovation through public awareness and education"
        ]
    },
    // 支持性促成者 - 通过意识和教育支持水资源管理的实体
    "database_k": {
        "title": " Supporting enablers",
        "sf": [
            "Stronger public voice",
            "Public awareness and acceptance for new technologies/innovation",
            "Universities to provide test beds and pilot opportunities",
            "Universities to leverage their conveyance power and bring together different actors to facilitate collaboration and knowledge sharing",
            "Universities to bring water experts with those from adjacent fields (cross-sector collaboration)",
            "Leverage an informal network of professionals who complement each other's skills and contributions",
            "Universities to connect innovators with private sources",
            "Stamp of approval (endorsement) of good/innovative ideas",
            "Learn from successes in other sectors, like energy, and apply those lessons to water",
            "Innovation culture being part of SF encourages stakeholders to explore and adopt novel solutions"
        ],
        "accra": [
            "Promoting research and development in water technologies",
            "Launching educational campaigns to shift societal perceptions",
            "Engaging communities in sustainable water practices",
            "Integrating local knowledge into decision-making processes",
            "Fostering innovation through public awareness and education"
        ]
    }
}; 