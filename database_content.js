// 数据库内容定义 - 存储不同利益相关者类别的信息，用于展示给用户
const DATABASE_CONTENT = {
    // 公共事业和私人基础设施提供商
    "database_a": {
        "title": " Public Utilities & Private Infrastructure Providers",
        "sf": ["San Francisco Public Utilities Commission (SFPUC)"],
        "accra": [
            "Community Water and Sanitation Agency (CWSA)",
            "Ghana Water Company",
            "Water Resources Commission (WRC)"
        ],
        "singapore": [
            "Public Utilities Board (PUB)",
            "Keppel",
            "Binnies"
        ],
        "valencia": [
            "Global Omnium (GO)"
        ]
    },

    "database_b": {
        "title": "Policy-makers & Regulators",
        "sf": [
            "California Water Environment Association (CWEA)",
            "California Department of Water Resources (DWR)"
        ],
        "accra": [
            "Public Utility Regulatory Commission (PURC)",
            "Ministry of Sanitation and Water Resources",
            "Environmental Protection Agency (EPA)"
        ],
        "singapore": [
            "Ministry of Sustainability and the Environment of Singapore"
        ],
        "valencia": [
            "Valencian Institute of Cooperation & Innovation (IVACE+i)",
            "Jucar River Authority (CHJ)"
        ]
    },
    // 创新者和企业家
    "database_c": {
        "title": " Innovators & Entrepreneurs",
        "sf": ["Epic Cleantec", "Fluid Analytics"],
        "accra": ["Pure Home Water", "Waterbits"],
        "singapore": ["Xylem", "Wateroam"],
        "valencia": ["Idrica & Xylem Vue", "Auravant", "Agrow Analytics", "Fivecomm"]
    },
    // 投资者和加速器
    "database_d": {
        "title": " Investors & Accelerators",
        "sf": ["Imagine H20", "Echo River Capital"],
        "accra": [],
        "singapore": [
            "National University of Singapore (NUS)",
            "Nanyang Technological University (NTU)",
            "PUB"
        ],
        "valencia": ["GoHub", "Clean Connect VLC"]
    },
    // 支持性利益相关者（如非政府组织、学术界、公民）
    "database_e": {
        "title": " Supporting Stakeholders",
        "subtitle": "e.g. NGOs, Academia, Citizens",
        "sf": ["Stanford University", "UC Berkeley", "Pacific Inst."],
        "accra": [
            "University of Ghana",
            "Council for Scientific and Industrial Research (CSIR)",
            "Kwame Nkrumah University of Science and Technology (KNUST)",
            "WaterAid",
            "UNICEF",
            "Coalition of NGOs in Water and Sanitation (CONIWAS) ",
            "Ghana Borehole Drillers Association (GBDA)",
            "National Association of Sachet & Packaged Water Producers (NASPWP)"
        ],
        "singapore": [
            "NTU",
            "NUS",
            "World Trade Organization (WTO)",
            "Singapore Water Association (SWA)"
        ],
        "valencia": [
            "Polytechnic University of Valencia (UPV; DIHMA & IIAMA)",
            "Spanish Water Technology Platform (PTEA)"
        ]
    },
    // 内部级治理促成者 - 支持新政策和法规的实体
    "database_f": {
        "title": "Intra-level Governance enablers",
        "sf": [
            "Address regulatory barriers and launch new policies that support new technologies and their procurement processes",
            "→ Utilities to support and promote the new policies"
        ],
        "accra": ["Strengthening governance and policy enforcement"],
        "singapore": [
            "Strong public trust and government funding",
            "Dominant governance and strategic leadership",
            "Clear long-term strategic goals and resilience planning integrated into national policy agendas"
        ],
        "valencia": []
    },
    // 内部级水创业促成者 - 支持水领域创新的实体
    "database_g": {
        "title": "Intra-level Aquapreneurship enablers",
        "sf": [
            "Non-dilutive pilot funding",
            "Start-ups/innovators to improve storytelling and marketing capabilities to attract more attention and resources",
            "Have international presence (e.g., Asia, India) to understand market dynamics and provide tailored support to startups"
        ],
        "accra": ["Incentivising employee innovation and creativity "],
        "singapore": [
            "Support from academic programmes (e.g., NUS Hydropreneur Programme) providing funding and visibility through awards",
            "Long-term investment in knowledge infrastructure and translation of research into application"
        ],
        "valencia": [
            "Investment fund for technology startups (GoHub) as a complement to promote technology transfer",
            "Valencia's innovation actors (e.g., GoHub, Idrica) operate autonomously within a connected ecosystem, enabling flexible startup scaling and decentralised experimentation",
            "Decentralised innovation governance allows regional actors like GoHub and Clean Connect VLC to independently scale startups without centralised control",
            "Entrepreneurial ecosystem prioritises open innovation and rapid iteration, attracting both domestic and international innovators "
        ]
    },
    // 跨级个人促成者 - 支持个人层面水资源管理的实体
    "database_h": {
        "title": " Trans-level Individual enablers",
        "sf": [
            "1. Public Utilities & Private Infrastructure Providers to Innovators & Entrepreneurs",
            "Bring practitioners and innovators together with clear & supported procurement processes",
            "Utilities to provide a trial-basis to showcase that things work before moving to the next stages",
            "2. Policy-makers & Regulators to Investors & Accelerators",
            "Address regulatory barriers and launch new policies that support new technologies and their procurement processes",
            "Partnerships and collaborations between accelerators and other local entities, government agencies and other regional actors ",
            "Advocate for innovation-friendly policies for water start-ups",
        ],
        "accra": [
            "1. Public Utilities & Private Infrastructure Providers to Innovators & Entrepreneurs",
            "Adopting transparent procurement practices",
            "Incentivising employee innovation and creativity (if through piloting)",
            "Conducting training for staff",
            "2. Policy-makers & Regulators to Investors & Accelerators",
            "No data available",

        ],
        "singapore": [
            "1. Public Utilities & Private Infrastructure Providers to Innovators & Entrepreneurs",
            "Dedicated global collaboration platforms (e.g., Singapore International Water Week)",
            "Structured governmental support for scaling innovations internationally",
            "Enhanced storytelling and marketing training for water innovators, enhancing public visibility, stakeholder engagement, and investor attraction",
            "2. Policy-makers & Regulators to Investors & Accelerators",
            "Facilitate streamlined pathways from academic research to market commercialization through structured programs and targeted government incentives",
            "Establish innovation-friendly regulatory sandboxes, enabling startups and utilities to pilot emerging water technologies with reduced administrative barriers",
            "Promote collaborative frameworks connecting global innovation ecosystems, leveraging Singapore's international positioning to accelerate local technology deployment and scaling",
            "Strengthen alignment between academic institutions, utilities, and industry accelerators to optimize resources and accelerate the innovation adoption cycle"
        ],
        "valencia": [
            "1. Public Utilities & Private Infrastructure Providers to Innovators & Entrepreneurs",
            "Strategic support from utilities to create and support spin-offs like Idrica ",
            "Technological diversification (5G, satellites, AI) across water systems to diversify water technologies ",
            "2. Policy-makers & Regulators to Investors & Accelerators",
            "Adoption of localised technology through regional innovation centres and testbeds "
        ]
    },
    // 跨级多方利益相关者促成者 - 支持多方合作的实体
    "database_j": {
        "title": " Trans-level Multistakeholder enablers",
        "sf": [
            "1. Public Utilities & Private Infrastructure Providers to All",
            "Utilities/suppliers to feel responsibility to enable transformation",
            "Follow an streamlined process that requires a well-structured organisation",
            "Modulation and standardisation to reduce costs and ease processes",
            "Provide better data to inform decision-making and guide technology development",
            "Different rates for water consumption depending on the activity (higher rates for industrial use vs residential use)",
            "2. Policy-makers & Regulators to All",
            "Politicians that support innovation and see it as part of their legacy",
            "Plan for the long-term view and have individuals who aim to gain visibility outside their immediate environment",
            "Improve public perception and storytelling about water as a critical, high-priority issue",
            "3. Innovators & Entrepreneurs to All",
            "AI to foster and standardise decision-making (from C to others)",
            "4. Investors & Accelerators to All",
            "No data available",
            "5. All to All",
            "Be proactive instead of reactive, which requires time spent to set a certain programme",
            "Have a systemic view/understanding and a decision-support tools that links similar problems/issues together and studies the trade-offs between different habitats and technologies",
            "Involve non-governmental actors (private sector, academia, NGOs, etc.) to enhance collaboration and foster innovation",
            "Foster private-public partnerships (PPPs)"
        ],
        "accra": [
            "1. Public Utilities & Private Infrastructure Providers to All",
            "Fostering public-private partnerships for resource mobilisation",
            "Implementing change management with early stakeholder engagement (in the context of utilities)",
            "Investing in critical infrastructure upgrades",
            "2. Policy-makers & Regulators to All",
            "Strong leadership commitment to innovation",
            "Developing a stable regulatory framework",
            "Providing financial incentives for smart water technologies",
            "Streamlining approval processes for water projects",
            "Leveraging policy incentives to drive technology adoption",
            "3. Innovators & Entrepreneurs to All",
            "No data available",
            "4. Investors & Accelerators to All",
            "No data available",
            "5. All to All",
            "Utilising digital tools and data for monitoring performance",
            "→ Encouraging data-driven decision-making in water management",
            "Enhancing inter-agency and cross-sector collaboration",
            "→ Collaborating with international experts and institutions",
            "Ensuring access to dedicated funding for water innovation projects",
            "Promoting a culture of continuous improvement and innovation",
            "→ Facilitating knowledge sharing across stakeholders",
            "→ Creating platforms for multi-stakeholder dialogue"
        ],
        "singapore": [
            "1. Public Utilities & Private Infrastructure Providers to All",
            "Multidisciplinary ecosystems facilitated by implementation agencies (PUB)",
            "Strategic international media and advocacy campaigns",
            "2. Policy-makers & Regulators to All",
            "Streamlined administrative processes and improved data-sharing frameworks",
            "Government initiatives using real-time monitoring, IoT, AI-driven automation",
            "3. Innovators & Entrepreneurs to All",
            "Innovators providing accessible demonstration projects showcasing proven technological capabilities and effectiveness to government and public utilities",
            "Entrepreneur-led international partnerships and participation in global innovation competitions (e.g., Earthshot Prize, Uplink) to drive awareness, foster global networking, and attract cross-border investment and scaling opportunities",
            "Innovators contributing directly to policy and strategy through targeted consultations and direct engagements with regulators and policymakers, demonstrating industry insights to shape supportive regulatory frameworks",
            "4. Investors & Accelerators to All",
            "No data available",
            "5. All to All",
            "Comprehensive national water strategy (public-private partnerships, infrastructure financing)",
            "Strong government-industry-academia collaboration, established public trust",
            "Strategic emphasis on interdisciplinary and cross-sector collaborations (water-energy nexus, integrated urban systems)",
            "Dedicated governmental taskforces bridging utilities, academia, private sector, and NGOs to continuously refine and improve innovation and regulatory frameworks"
        ],
        "valencia": [
            "1. Public Utilities & Private Infrastructure Providers to All",
            "No data available",
            "2. Policy-makers & Regulators to All",
            "Openness to new water management technologies driven by institutional innovation",
            "Application of EU Water Framework Directive promoting harmonised policy uptake ",
            "Transparency in hydrological data and real-time information updates",
            "Public sector Investment instruments (e.g. infrastructure funding, digitilisation budgets and irrigation subsidies)",
            "3. Innovators & Entrepreneurs to All",
            "Collaboration platforms and regional innovation testbeds connect government, academia, and industry to co-develop and scale water solutions",
            "4. Investors & Accelerators to All",
            "Cross-sector startup acceleration led by GoHub and Clean Connect VLC",
            "5. All to All",
            "Public-private partnership models (PPP) and data-sharing mechanisms",
            "Development of free-access software and modernisation of infrastructure",
            "Digitalization of water information systems across sectors",
            "Technological platforms supporting circular economy integration"
        ]
    },
    // 支持性促成者 - 通过意识和教育支持水资源管理的实体
    "database_k": {
        "title": " Supporting enablers",
        "sf": [
            "Stronger public voice",
            "Universities to provide test beds and pilot opportunities (derisks adoption from public agencies and moves innovations from the lab to the field) ",
            "Universities to leverage their conveyance power and bring together different actors to facilitate collaboration and knowledge sharing ",
            "→ Universities to bring water experts with those from adjacent fields (cross-sector collaboration)",
            "→ Leverage an informal network of professionals who complement each other's skills and contributions",
            "Universities to connect innovators with private sources",
            "Innovation culture being part of SF encourages stakeholders to explore and adopt novel solutions",
            "→ Public awareness and acceptance for new technologies/innovation",
            "Stamp of approval (endorsement) of good/innovative ideas",
            "Learn from successes in other sectors, like energy, and apply those lessons to water",
        ],
        "accra": [
            "Promoting research and development in water technologies",
            "Launching educational campaigns to shift societal perceptions",
            "Engaging communities in sustainable water practices",
            "Integrating local knowledge into decision-making processes",
            "Fostering innovation through public awareness and education"
        ],
        "singapore": [
            "Targeted support mechanisms for research-based innovation scaling",
            "Mission-driven applied research by universities supporting national priorities",
            "Affordable sanitation solutions through private-sector innovation and strong NGO-government partnerships (from NGO to all)",
            "Universities proactively facilitating international research partnerships and knowledge-sharing exchanges, enhancing local expertise through global exposure and reciprocal learning"
        ],
        "valencia": [
            "Academic leadership in water planning and decision support (e.g., Aquatool or TETIS model at UPV)",
            "Strategic dissemination of water innovation and support tools through professional associations and collaborative networks",
            "Cross-sector knowledge sharing through Living Labs and technical universities ",
            "Environmental indicators tied to performance of local water governance ",
            "Involvement in European research programs and international university networks that offer institutional support and funding for long-term water innovation projects",
            "Strong linkage between academic R&D and commercialization pathways through joint ventures and tech transfer programs",
            "Hydrological planning every six years (knowledge structuring and forecasting)",
            "Legislative incentives encouraging technology adoption and water reuse "
        ]
    }
}; 

// 为所有 database_a ~ database_k 补全 singapore 和 valencia 字段，若无内容则为 []。
Object.keys(DATABASE_CONTENT).forEach(key => {
    if (!DATABASE_CONTENT[key].singapore) DATABASE_CONTENT[key].singapore = [];
    if (!DATABASE_CONTENT[key].valencia) DATABASE_CONTENT[key].valencia = [];
}); 