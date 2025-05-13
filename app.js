/**
 * Water-BOOST Technology Selector
 * JavaScript implementation of the application logic
 * 水资源技术选择器的JavaScript实现
 */

// 全局变量 - 保存应用的状态
let selectedCity = '';       // 用户选择的城市
let currentStep = 1;         // 当前步骤
const totalSteps = 15;       // 总步骤数
let capacity = null;         // 能力级别 (高/中/低)
let history = [];            // 总历史记录
let stakeholderHistory = []; // 利益相关者流程历史
let techHistory = [];        // 技术选择历史
let stakeholderStep = 0;     // 利益相关者当前步骤
let techStep = 0;            // 技术选择当前步骤

// 利益相关者流程数据 - 定义流程中每一步的问题和可能的路径
const stakeholderFlowData = {
    "start": {
        "question": "Are all Public Utilities & Private Infrastructure Providers present?", // 所有公共事业和私人基础设施提供商是否都在场？
        "yes": "policy_makers",
        "no": "database_a",
        "step": 1
    },
    "policy_makers": {
        "question": "Are all Policy-makers & Regulators present?", // 所有政策制定者和监管者是否都在场？
        "yes": "governance",
        "no": "database_b",
        "step": 2,
        "previous": "start"
    },
    "governance": {
        "question": "Check: Are all Governance stakeholders present?", // 检查：所有治理相关的利益相关者是否都在场？
        "yes": "innovators",
        "no": "start",
        "step": 3,
        "previous": "policy_makers"
    },
    "innovators": {
        "question": "Are all Innovators & Entrepreneurs present?", // 所有创新者和企业家是否都在场？
        "yes": "investors",
        "no": "database_c",
        "step": 4,
        "previous": "governance"
    },
    "investors": {
        "question": "Are all Investors & Accelerators present?", // 所有投资者和加速器是否都在场？
        "yes": "aquapreneurship",
        "no": "database_d",
        "step": 5,
        "previous": "innovators"
    },
    "aquapreneurship": {
        "question": "Check: Are all Aquapreneurship stakeholders present?", // 检查：所有水创业利益相关者是否都在场？
        "yes": "supporting",
        "no": "innovators",
        "step": 6,
        "previous": "investors"
    },
    "supporting": {
        "question": "Are all Supporting Stakeholders present?", // 所有支持性利益相关者是否都在场？
        "yes": "intra_level",
        "no": "database_e",
        "step": 7,
        "previous": "aquapreneurship"
    },
    "intra_level": {
        "question": "Are all Intra-level Governance enablers present?", // 所有内部级治理促成者是否都在场？
        "yes": "intra_aqua",
        "no": "database_f",
        "step": 8,
        "previous": "supporting"
    },
    "intra_aqua": {
        "question": "Are all Intra-level Aquapreneurship enablers present?", // 所有内部级水创业促成者是否都在场？
        "yes": "check_intra",
        "no": "database_g",
        "step": 9,
        "previous": "intra_level"
    },
    "check_intra": {
        "question": "Check: Are all Intra-level enablers present?", // 检查：所有内部级促成者是否都在场？
        "yes": "trans_individual",
        "no": "intra_level",
        "step": 10,
        "previous": "intra_aqua"
    },
    "trans_individual": {
        "question": "Are all Trans-level Individual enablers present?", // 所有跨级个人促成者是否都在场？
        "yes": "trans_multi",
        "no": "database_h",
        "step": 11,
        "previous": "check_intra"
    },
    "trans_multi": {
        "question": "Are all Trans-level Multi-stakeholder enablers present?", // 所有跨级多方利益相关者促成者是否都在场？
        "yes": "check_trans",
        "no": "database_j",
        "step": 12,
        "previous": "trans_individual"
    },
    "check_trans": {
        "question": "Check: Are all Trans-level enablers present?", // 检查：所有跨级促成者是否都在场？
        "yes": "final_check",
        "no": "trans_individual",
        "step": 13,
        "previous": "trans_multi"
    },
    "final_check": {
        "question": "Are all Supporting enablers present?", // 所有支持性促成者是否都在场？
        "yes": "end",
        "no": "database_k",
        "step": 14,
        "previous": "check_trans"
    }
};

let currentStakeholderState = "start"; // 当前利益相关者状态，初始为起点

// 页面元素获取函数 - 简化DOM元素访问
const $ = id => document.getElementById(id);

// 页面切换函数 - 在不同页面间导航
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    $(pageId).classList.add('active');
}

// 更新进度条 - 视觉反馈用户当前进度
function updateProgress(step, totalSteps, progressId, textId) {
    const progressPercent = (step / totalSteps) * 100;
    $(progressId).style.width = `${progressPercent}%`;
    $(textId).textContent = `Progress: Step ${step} of ${totalSteps}`;
}

// 城市选择处理 - 用户选择城市后初始化利益相关者流程
function selectCity(city) {
    selectedCity = city;
    history = ['citySelection'];
    stakeholderHistory = [];
    currentStakeholderState = "start";
    
    // 更新城市名称显示
    if($('cityNameDisplay')) {
        $('cityNameDisplay').textContent = city;
    }
    
    // 显示对应城市的图表
    if (city === 'San Francisco') {
        if($('sfDiagram')) $('sfDiagram').style.display = 'flex';
        if($('accraDiagram')) $('accraDiagram').style.display = 'none';
    } else {
        if($('accraDiagram')) $('accraDiagram').style.display = 'flex';
        if($('sfDiagram')) $('sfDiagram').style.display = 'none';
    }
    
    // 显示利益相关者流程页面
    showPage('stakeholderFlow');
    
    // 设置第一个问题
    updateStakeholderQuestion();
}

// 返回城市选择页面 - 重置应用状态回到起点
function returnToCitySelection() {
    showPage('citySelection');
    // 重置所有状态
    history = [];
    stakeholderHistory = [];
    techHistory = [];
    stakeholderStep = 0;
    techStep = 0;
    capacity = null;
    currentStakeholderState = "start";
}

// 技术选择器返回功能 - 技术流程的后退功能
function techGoBack() {
    if (techHistory.length > 0) {
        // 获取上一个状态
        const lastState = techHistory.pop();
        
        // 处理不同类型的历史记录
        if (typeof lastState === 'string') {
            // 处理字符串类型的历史（函数名称）
            switch(lastState) {
                case 'showCapacitySelection':
                    showCapacitySelection();
                    break;
                case 'start':
                    startTechnologyFlow();
                    break;
                default:
                    // 如果是其他字符串，尝试作为函数名调用
                    if (typeof window[lastState] === 'function') {
                        window[lastState]();
                    } else {
                        startTechnologyFlow();
                    }
            }
        } else if (typeof lastState === 'object') {
            // 处理对象类型的历史（包含function属性）
            if (lastState.function) {
                switch(lastState.function) {
                    case 'start':
                        startTechnologyFlow();
                        break;
                    case 'high_capacity_flow':
                        highCapacityFlow();
                        break;
                    case 'high_digital_transformation':
                        highDigitalTransformation();
                        break;
                    case 'high_water_scarcity':
                        highWaterScarcity();
                        break;
                    case 'moderate_capacity_flow':
                        moderateCapacityFlow();
                        break;
                    case 'moderate_agricultural_efficiency':
                        moderateAgriculturalEfficiency();
                        break;
                    case 'low_capacity_flow':
                        lowCapacityFlow();
                        break;
                    case 'low_community_resilience':
                        lowCommunityResilience();
                        break;
                    default:
                        // 尝试作为函数名调用
                        if (typeof window[lastState.function] === 'function') {
                            window[lastState.function]();
                        } else {
                            startTechnologyFlow();
                        }
                }
            } else {
                startTechnologyFlow();
            }
        } else {
            startTechnologyFlow();
        }
    }
}

// 返回上一步 - 利益相关者流程的后退功能
function goBack() {
    if (stakeholderHistory.length > 0) {
        // 获取上一个状态
        currentStakeholderState = stakeholderHistory.pop();
        
        // 更新UI
        updateStakeholderQuestion();
    }
}

// 更新利益相关者问题 - 根据当前状态显示相应问题
function updateStakeholderQuestion() {
    const currentState = stakeholderFlowData[currentStakeholderState];
    
    // 更新问题文本
    $('questionText').textContent = currentState.question;
    
    // 更新进度
    stakeholderStep = currentState.step;
    
    // 控制按钮显示 - 第一个问题只显示返回城市按钮，其他问题只显示返回上一问题按钮
    if (currentStakeholderState === "start") {
        // 第一个问题页：隐藏返回问题按钮，显示返回城市按钮
        $('backButton').style.display = 'none';
        $('backToCityButton').style.display = 'block';
    } else {
        // 其他问题页：显示返回问题按钮，隐藏返回城市按钮
        $('backButton').style.display = 'block';
        $('backToCityButton').style.display = 'none';
    }
}

// 处理用户对利益相关者问题的回答
function handleResponse(isYes) {
    // 记录当前状态到历史记录
    stakeholderHistory.push(currentStakeholderState);
    
    const currentState = stakeholderFlowData[currentStakeholderState];
    
    // 检查是否是"Are all Supporting enablers present?"问题且用户点击了"是"
    if (currentStakeholderState === "final_check" && isYes) {
        // 显示分析完成弹窗
        showCompletionModal();
        return;
    }
    
    if (isYes) {
        // 用户点击"是"
        if (currentState.yes === "end") {
            // 如果是最后一个问题，显示结束信息
            showEndMessage();
        } else {
            // 否则进入下一个问题
            currentStakeholderState = currentState.yes;
            updateStakeholderQuestion();
        }
    } else {
        // 用户点击"否"
        if (currentState.no.startsWith("database_")) {
            // 显示相应的数据库信息
            showDatabaseMessage(currentState.no);
        } else {
            // 否则进入指定的问题
            currentStakeholderState = currentState.no;
            updateStakeholderQuestion();
        }
    }
}

// 显示分析完成弹窗
function showCompletionModal() {
    const modal = document.getElementById('completionModal');
    modal.style.display = 'flex';
}

// 关闭分析完成弹窗
function closeCompletionModal() {
    const modal = document.getElementById('completionModal');
    modal.style.display = 'none';
    
    // 关闭弹窗后直接启动技术选择流程，而不是显示中间页面
    startTechnologyFlow();
}

// 启动技术选择流程 - 从利益相关者流程转到技术选择器
function startTechnologyFlow() {
    history.push('technologySelector');
    
    // 重置技术流程历史
    techHistory = [];
    techStep = 1;
    
    // 显示技术选择器页面
    showPage('technologySelector');
    
    // 显示第一个问题"Are all enablers present?"
    $('techQuestionCard').style.display = 'block';
    $('capacitySelection').style.display = 'none';
    $('resultDisplay').style.display = 'none';
    $('techQuestionText').textContent = "Are all enablers present?";
    
    // 设置按钮回调函数
    window.currentTechQuestionFunction = "firstTechQuestion";
    window.yesFunction = "secondTechQuestion";
    window.noFunction = "showEnablersNotPresentResult";
}

// 显示能力选择界面
function showCapacitySelection() {
    techHistory.push({
        function: window.currentTechQuestionFunction,
        step: techStep
    });
    
    // 隐藏问题卡片，显示能力选择
    $('techQuestionCard').style.display = 'none';
    $('capacitySelection').style.display = 'block';
    $('resultDisplay').style.display = 'none';
}

// 第二个问题 - 询问是否有记录的水资源战略
function secondTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "secondTechQuestion";
    $('techQuestionText').textContent = "Is there a documented water strategy at a municipal, regional, or national level?";
    window.yesFunction = "thirdTechQuestion";
    window.noFunction = "showNoWaterStrategyResult";
}

// 第三个问题 - 询问战略是否包括明确优先级的水问题
function thirdTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "thirdTechQuestion";
    $('techQuestionText').textContent = "Does the strategy include clearly ranked or funded water issues?";
    window.yesFunction = "fourthTechQuestion";
    window.noFunction = "showNoWaterPriorityResult";
}

// 第四个问题 - 询问是否有与气候和农业相关的目标
function fourthTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "fourthTechQuestion";
    $('techQuestionText').textContent = "Are specific water-related goals tied to climate, agriculture or urban resilience plans?";
    window.yesFunction = "fifthTechQuestion";
    window.noFunction = "showNoWaterPriorityResult";
}

// 第五个问题 - 询问是否有利益相关者共识
function fifthTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "fifthTechQuestion";
    $('techQuestionText').textContent = "Is stakeholder consensus visible around priority areas?";
    window.yesFunction = "sixthTechQuestion";
    window.noFunction = "showNoWaterPriorityResult";
}

// 第六个问题 - 询问治理是否集中
function sixthTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "sixthTechQuestion";
    $('techQuestionText').textContent = "Is governance predominantly centralised (e.g., central agency or PPP)?";
    window.yesFunction = "showCapacitySelection";
    window.noFunction = "sixthBTechQuestion";
}

// 第六B个问题 - 询问地方权力
function sixthBTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    
    window.currentTechQuestionFunction = "sixthBTechQuestion";
    $('techQuestionText').textContent = "Is local/municipal authority empowered with budget and policy control?";
    window.yesFunction = "showCapacitySelection";
    window.noFunction = "showRebuildCapacityResult";
}

// 显示无法识别技术选择时的结果
function showEnablersNotPresentResult() {
    showResult(
        "Recommendation",
        "Return to enabler assessment."
    );
}

// 显示没有水战略的结果
function showNoWaterStrategyResult() {
    showResult(
        "Recommendation",
        "Regional water priority is NOT clearly defined."
    );
}

// 显示没有水优先级的结果
function showNoWaterPriorityResult() {
    showResult(
        "Recommendation",
        "Regional water priority is NOT clearly defined."
    );
}

// 显示需要重建能力的结果
function showRebuildCapacityResult() {
    showResult(
        "Recommendation",
        "Rebuild capacity for decentralised governance."
    );
}

// 显示技术推荐结果
function showResult(title, message) {
    // 隐藏问题卡片
    $('techQuestionCard').style.display = 'none';
    
    // 获取技术名称（从消息中提取）
    const techName = message.replace("Recommendation", "").trim();
    
    // 准备详细信息字典
    const detailedInfo = getTechDetails(techName);
    
    // 清空结果区域的内容
    $('resultDisplay').innerHTML = '';
    $('resultDisplay').style.display = 'block';
    
    // 创建结果区域的标题部分
    const titleContainer = document.createElement('div');
    titleContainer.className = 'result-title';
    
    // 添加勾选图标（只有在推荐技术时显示）
    if (title.includes("Recommended")) {
        const checkIcon = document.createElement('span');
        checkIcon.className = 'check-icon';
        checkIcon.textContent = '✅ ';
        titleContainer.appendChild(checkIcon);
    }
    
    // 添加标题文本
    const titleText = document.createElement('h2');
    titleText.textContent = techName;
    titleText.style.color = '#333';
    titleText.style.margin = '10px 0';
    titleContainer.appendChild(titleText);
    
    $('resultDisplay').appendChild(titleContainer);
    
    // 如果有详细信息，则显示
    if (detailedInfo) {
        // 创建详细信息容器
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'tech-details';
        detailsContainer.style.backgroundColor = '#f9f9f9';
        detailsContainer.style.padding = '20px';
        detailsContainer.style.borderRadius = '8px';
        detailsContainer.style.marginTop = '20px';
        
        // 添加各项详细信息
        for (const [key, value] of Object.entries(detailedInfo)) {
            const detailItem = document.createElement('div');
            detailItem.style.marginBottom = '15px';
            detailItem.style.display = 'flex';
            detailItem.style.alignItems = 'flex-start';
            
            // 添加图标
            const icon = document.createElement('span');
            icon.style.marginRight = '10px';
            icon.style.fontSize = '20px';
            icon.textContent = value.icon;
            detailItem.appendChild(icon);
            
            // 添加详细文本
            const textContent = document.createElement('div');
            const label = document.createElement('strong');
            label.textContent = key + ': ';
            textContent.appendChild(label);
            
            const description = document.createTextNode(value.text);
            textContent.appendChild(description);
            
            detailItem.appendChild(textContent);
            detailsContainer.appendChild(detailItem);
        }
        
        $('resultDisplay').appendChild(detailsContainer);
    } else {
        // 如果没有详细信息，只显示消息文本
        const messageElem = document.createElement('p');
        messageElem.textContent = message;
        messageElem.style.backgroundColor = '#f9f9f9';
        messageElem.style.padding = '20px';
        messageElem.style.borderRadius = '8px';
        messageElem.style.margin = '20px 0';
        $('resultDisplay').appendChild(messageElem);
    }
    
    // 添加"Start Over"按钮
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '30px';
    
    const startOverBtn = document.createElement('button');
    startOverBtn.className = 'modern-button primary';
    startOverBtn.textContent = 'Start Over';
    startOverBtn.onclick = returnToCitySelection;
    buttonContainer.appendChild(startOverBtn);
    
    $('resultDisplay').appendChild(buttonContainer);
}

// 获取技术详细信息
function getTechDetails(techName) {
    const techDetails = {
        "Digital Twin Technology": {
            "What it is": {
                icon: "💡",
                text: "Real-time digital models of water networks using AI & IoT."
            },
            "Hype Cycle": {
                icon: "📈",
                text: "Peak of Inflated Expectations."
            },
            "Why": {
                icon: "🧠",
                text: "Aligns with high capacity and digital readiness."
            },
            "Where": {
                icon: "🌍",
                text: "Singapore (PUB), UK (Thames)."
            },
            "Cost": {
                icon: "💰",
                text: "High – includes modelling & data infrastructure."
            },
            "Timeline": {
                icon: "⏱️",
                text: "Medium to long term."
            },
            "Additional": {
                icon: "🔍",
                text: "Needs strong digital policy and data integration."
            }
        },
        "Advanced Wastewater Recycling": {
            "What it is": {
                icon: "💡",
                text: "Uses membrane bioreactors, UV disinfection, and reverse osmosis."
            },
            "Hype Cycle": {
                icon: "📈",
                text: "Plateau of Productivity – adopted in many regions."
            },
            "Why": {
                icon: "🧠",
                text: "Ideal for water-scarce, high-capacity regions."
            },
            "Where": {
                icon: "🌍",
                text: "Singapore (NEWater), California, Australia."
            },
            "Cost": {
                icon: "💰",
                text: "High – operational cost decreases at scale."
            },
            "Timeline": {
                icon: "⏱️",
                text: "Medium term (2–4 years)."
            },
            "Additional": {
                icon: "🔍",
                text: "Requires strong regulatory trust and public acceptance."
            }
        },
        "AI Leak Detection": {
            "What it is": {
                icon: "💡",
                text: "Uses AI to analyse sensor data from smart meters to detect leaks."
            },
            "Hype Cycle": {
                icon: "📈",
                text: "Peak of Inflated Expectations."
            },
            "Why": {
                icon: "🧠",
                text: "Helps optimise existing networks, especially with ageing infrastructure."
            },
            "Where": {
                icon: "🌍",
                text: "Barcelona, Singapore, UK (Severn Trent)."
            },
            "Cost": {
                icon: "💰",
                text: "Moderate to high – depends on sensor network and analytics."
            },
            "Timeline": {
                icon: "⏱️",
                text: "Short to medium term."
            },
            "Additional": {
                icon: "🔍",
                text: "Needs sensor integration and strong AI/data governance."
            }
        },
        "Smart Irrigation & IoT": {
            "What it is": {
                icon: "💡",
                text: "Sensors measure weather, soil and crop data to optimise irrigation."
            },
            "Hype Cycle": {
                icon: "📈",
                text: "Slope of Enlightenment – gaining traction in agri-tech."
            },
            "Why": {
                icon: "🧠",
                text: "Strong fit for moderate-capacity regions with active pilot support."
            },
            "Where": {
                icon: "🌍",
                text: "India, Israel, California."
            },
            "Cost": {
                icon: "💰",
                text: "Moderate – varies based on scale and sensor density."
            },
            "Timeline": {
                icon: "⏱️",
                text: "Short term."
            },
            "Additional": {
                icon: "🔍",
                text: "Best applied in areas with clear water-energy-agriculture policy."
            }
        },
        "Nature-Based Solutions": {
            "What it is": {
                icon: "💡",
                text: "Uses wetlands, green buffers, and natural ecosystems to manage water."
            },
            "Hype Cycle": {
                icon: "📈",
                text: "Innovation Trigger – early adoption."
            },
            "Why": {
                icon: "🧠",
                text: "Supports ecosystem-based strategies and urban resilience."
            },
            "Where": {
                icon: "🌍",
                text: "Netherlands, Singapore, New York."
            },
            "Cost": {
                icon: "💰",
                text: "Low to moderate – capital costs vary by local conditions."
            },
            "Timeline": {
                icon: "⏱️",
                text: "Medium term."
            },
            "Additional": {
                icon: "🔍",
                text: "Requires strong stakeholder alignment and ecological policy support."
            }
        },
        "Decentralised Water Treatment Systems": {
            "What it is": {
                icon: "💡",
                text: "Small-scale treatment systems managed at the community level."
            },
            "Hype Cycle": {
                icon: "📈",
                text: "Slope of Enlightenment – adopted in low-capacity regions."
            },
            "Why": {
                icon: "🧠",
                text: "Ideal for low-capacity, community-led interventions."
            },
            "Where": {
                icon: "🌍",
                text: "Kenya, Ghana, NGO-led programmes."
            },
            "Cost": {
                icon: "💰",
                text: "Low – local builds and NGO support."
            },
            "Timeline": {
                icon: "⏱️",
                text: "Short term (1–2 years)."
            },
            "Additional": {
                icon: "🔍",
                text: "Needs partnership-building and local engagement."
            }
        }
    };
    
    // 根据技术名称查找对应的详细信息
    for (const [key, value] of Object.entries(techDetails)) {
        if (techName.includes(key)) {
            return value;
        }
    }
    
    return null; // 如果找不到匹配的技术
}

// 设置能力水平 - 用户选择系统容量级别(高/中/低)
function setCapacity(level) {
    capacity = level;
    // 这里使用函数名而不是对象，以保持与其他历史记录的一致性
    techHistory.push("showCapacitySelection");
    techStep++;
    
    // 根据选择的能力水平进入不同的流程
    if (level === 'high') {
        highCapacityFlow();
    } else if (level === 'moderate') {
        moderateCapacityFlow();
    } else if (level === 'low') {
        lowCapacityFlow();
    }
    
    // 隐藏能力选择UI
    $('capacitySelection').style.display = 'none';
    $('techQuestionCard').style.display = 'block';
}

// 处理用户对技术问题的回答
function handleTechResponse(isYes) {
    // 保存当前状态到历史记录中 - 使用字符串而不是对象
    techHistory.push(window.currentTechQuestionFunction);
    
    // 增加技术流程步骤
    techStep++;
    
    // 根据当前问题的回答路径执行下一个函数
    if (isYes) {
        // 如果用户选择"是"
        if (window.yesFunction) {
            window[window.yesFunction]();
        } else {
            console.error("未定义的yes函数");
        }
    } else {
        // 如果用户选择"否"
        if (window.noFunction) {
            window[window.noFunction]();
        } else {
            console.error("未定义的no函数");
        }
    }
    
    // 显示/隐藏返回按钮
    $('techBackButton').style.display = techHistory.length > 0 ? 'inline-block' : 'none';
}

// 显示数据库信息 - 展示缺失的利益相关者信息
function showDatabaseMessage(databaseId) {
    // 获取数据库内容
    const databaseContent = DATABASE_CONTENT[databaseId];
    
    if (!databaseContent) {
        console.error("未找到数据库内容:", databaseId);
        return;
    }
    
    // 设置数据库标题
    $('databaseTitle').textContent = databaseContent.title;
    
    // 设置副标题（如果有）
    if (databaseContent.subtitle) {
        $('databaseSubtitle').textContent = databaseContent.subtitle;
        $('databaseSubtitle').style.display = 'block';
    } else {
        $('databaseSubtitle').style.display = 'none';
    }
    
    // 设置城市名称
    $('firstCityName').textContent = 'San Francisco';
    $('secondCityName').textContent = 'Accra';
    
    // 清空列表
    $('firstCityList').innerHTML = '';
    $('secondCityList').innerHTML = '';
    
    // 填充旧金山数据
    if (databaseContent.sf && databaseContent.sf.length > 0) {
        databaseContent.sf.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            $('firstCityList').appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No data available';
        li.className = 'no-data';
        $('firstCityList').appendChild(li);
    }
    
    // 填充阿克拉数据
    if (databaseContent.accra && databaseContent.accra.length > 0) {
        databaseContent.accra.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            $('secondCityList').appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No data available';
        li.className = 'no-data';
        $('secondCityList').appendChild(li);
    }
    
    // 显示数据库窗口
    showPage('databaseWindow');
}

// 关闭数据库页面 - 返回利益相关者流程
function closeDatabase() {
    // 根据历史记录判断从哪里来
    if (history.length > 0 && history[history.length - 1] === 'stakeholderFlow') {
        showPage('stakeholderFlow');
    } else if (history.length > 0 && history[history.length - 1] === 'technologySelector') {
        showPage('technologySelector');
    } else {
        // 默认返回利益相关者流程
        showPage('stakeholderFlow');
    }
}

// 显示最终信息 - 利益相关者流程完成后显示
function showEndMessage() {
    // 显示完成消息
    $('questionText').textContent = "Congratulations! All stakeholders are present for water technology innovation in " + selectedCity + ". You can now proceed to the Technology Selector.";
    
    // 隐藏按钮
    document.querySelector('.stakeholder-buttons').innerHTML = `
        <button class="stakeholder-button primary" onclick="startTechnologyFlow()">Continue to Technology Selector</button>
        <button class="stakeholder-button secondary" onclick="returnToCitySelection()">Start Over</button>
    `;
}

// 返回利益相关者流程页面
function returnToStakeholderFlow() {
    history.push('stakeholderFlow');
    showPage('stakeholderFlow');
}

// 高容量流程
function highCapacityFlow() {
    // 更新问题卡片
    $('techQuestionCard').style.display = 'block';
    $('capacitySelection').style.display = 'none';
    $('resultDisplay').style.display = 'none';
    
    $('techQuestionText').textContent = "Is the regional priority Digital Transformation?";
    
    window.currentTechQuestionFunction = "highCapacityFlow";
    window.yesFunction = "highDigitalTransformation";
    window.noFunction = "highWaterScarcity";
}

// 高容量 - 数字化转型路径
function highDigitalTransformation() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "highDigitalTransformation";
    $('techQuestionText').textContent = "Does the region have government-supported IoT and AI infrastructure for water systems?";
    window.yesFunction = "highDigitalTransformation2";
    window.noFunction = "highWaterScarcity";
}

function highDigitalTransformation2() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "highDigitalTransformation2";
    $('techQuestionText').textContent = "Are academic institutions working with government on digital water technologies?";
    window.yesFunction = "showDigitalTwinResult";
    window.noFunction = "highWaterScarcity";
}

function showDigitalTwinResult() {
    showResult(
        "✅ Recommended Technology",
        "Digital Twin Technology"
    );
}

// 高容量 - 水资源稀缺路径
function highWaterScarcity() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "highWaterScarcity";
    $('techQuestionText').textContent = "Is the regional priority Water Scarcity?";
    window.yesFunction = "highWaterScarcity2";
    window.noFunction = "highInfrastructureEfficiency";
}

function highWaterScarcity2() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "highWaterScarcity2";
    $('techQuestionText').textContent = "Is there strong public trust, strategic leadership, and innovation scaling?";
    window.yesFunction = "showAdvancedWastewaterResult";
    window.noFunction = "highInfrastructureEfficiency";
}

function showAdvancedWastewaterResult() {
    showResult(
        "✅ Recommended Technology",
        "Advanced Wastewater Recycling"
    );
}

// 高容量 - 基础设施效率路径
function highInfrastructureEfficiency() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "highInfrastructureEfficiency";
    $('techQuestionText').textContent = "Is the regional priority Infrastructure Efficiency?";
    window.yesFunction = "highInfrastructureEfficiency2";
    window.noFunction = "showHighCapacityNoMatchResult";
}

function highInfrastructureEfficiency2() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "highInfrastructureEfficiency2";
    $('techQuestionText').textContent = "Is there a smart metering strategy or incentives to reduce Non–Revenue Water?";
    window.yesFunction = "showAILeakDetectionResult";
    window.noFunction = "showHighCapacityNoMatchResult";
}

function showAILeakDetectionResult() {
    showResult(
        "✅ Recommended Technology",
        "AI Leak Detection"
    );
}

function showHighCapacityNoMatchResult() {
    showResult(
        "Recommendation",
        "High capacity system does not meet tech criteria."
    );
}

// 中等容量流程
function moderateCapacityFlow() {
    // 更新问题卡片
    $('techQuestionCard').style.display = 'block';
    $('capacitySelection').style.display = 'none';
    $('resultDisplay').style.display = 'none';
    
    $('techQuestionText').textContent = "Is the regional priority Agricultural Efficiency?";
    
    window.currentTechQuestionFunction = "moderateCapacityFlow";
    window.yesFunction = "moderateAgriculturalEfficiency";
    window.noFunction = "moderateFloodManagement";
}

// 中等容量 - 农业效率路径
function moderateAgriculturalEfficiency() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "moderateAgriculturalEfficiency";
    $('techQuestionText').textContent = "Are there active pilot projects for smart irrigation in agriculture zones?";
    window.yesFunction = "moderateAgriculturalEfficiency2";
    window.noFunction = "moderateFloodManagement";
}

function moderateAgriculturalEfficiency2() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "moderateAgriculturalEfficiency2";
    $('techQuestionText').textContent = "Is the water–energy–agriculture nexus recognised in regional planning?";
    window.yesFunction = "showSmartIrrigationResult";
    window.noFunction = "moderateFloodManagement";
}

function showSmartIrrigationResult() {
    showResult(
        "✅ Recommended Technology",
        "Smart Irrigation & IoT"
    );
}

// 中等容量 - 洪水管理路径
function moderateFloodManagement() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "moderateFloodManagement";
    $('techQuestionText').textContent = "Is the regional priority Flood Management?";
    window.yesFunction = "moderateFloodManagement2";
    window.noFunction = "showModerateCapacityNoMatchResult";
}

function moderateFloodManagement2() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "moderateFloodManagement2";
    $('techQuestionText').textContent = "Is flood risk a documented regional priority?";
    window.yesFunction = "moderateFloodManagement3";
    window.noFunction = "showModerateCapacityNoMatchResult";
}

function moderateFloodManagement3() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "moderateFloodManagement3";
    $('techQuestionText').textContent = "Are ecosystem-based strategies in policy?";
    window.yesFunction = "moderateFloodManagement4";
    window.noFunction = "showModerateCapacityNoMatchResult";
}

function moderateFloodManagement4() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "moderateFloodManagement4";
    $('techQuestionText').textContent = "Is there NGO/media advocacy for sustainability?";
    window.yesFunction = "showNatureBasedSolutionsResult";
    window.noFunction = "showModerateCapacityNoMatchResult";
}

function showNatureBasedSolutionsResult() {
    showResult(
        "✅ Recommended Technology",
        "Nature-Based Solutions"
    );
}

function showModerateCapacityNoMatchResult() {
    showResult(
        "Recommendation",
        "Moderate capacity not aligned to current priority."
    );
}

// 低容量流程
function lowCapacityFlow() {
    // 更新问题卡片
    $('techQuestionCard').style.display = 'block';
    $('capacitySelection').style.display = 'none';
    $('resultDisplay').style.display = 'none';
    
    $('techQuestionText').textContent = "Is the regional priority Community Resilience?";
    
    window.currentTechQuestionFunction = "lowCapacityFlow";
    window.yesFunction = "lowCommunityResilience";
    window.noFunction = "showLowCapacityNoMatchResult";
}

// 低容量 - 社区弹性路径
function lowCommunityResilience() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "lowCommunityResilience";
    $('techQuestionText').textContent = "Are there community–led pilots for water treatment?";
    window.yesFunction = "lowCommunityResilience2";
    window.noFunction = "showLowCapacityNoMatchResult";
}

function lowCommunityResilience2() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "lowCommunityResilience2";
    $('techQuestionText').textContent = "Is there support for hydropreneurs or startups?";
    window.yesFunction = "lowCommunityResilience3";
    window.noFunction = "showLowCapacityNoMatchResult";
}

function lowCommunityResilience3() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    
    window.currentTechQuestionFunction = "lowCommunityResilience3";
    $('techQuestionText').textContent = "Are local authorities active in urban water control?";
    window.yesFunction = "showDecentralisedWaterTreatmentResult";
    window.noFunction = "showLowCapacityNoMatchResult";
}

function showDecentralisedWaterTreatmentResult() {
    showResult(
        "✅ Recommended Technology",
        "Decentralised Water Treatment Systems"
    );
}

function showLowCapacityNoMatchResult() {
    showResult(
        "Recommendation",
        "Low capacity systems require foundational support."
    );
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 显示城市选择页面
    showPage('citySelection');
    
    // 预加载图表图片
    const sfImg = new Image();
    sfImg.src = 'flow-diagram-sf.svg';
    
    const accraImg = new Image();
    accraImg.src = 'flow-diagram-accra.svg';
}); 