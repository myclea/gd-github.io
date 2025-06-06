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
        "question": "Are Public Utilities & Private Infrastructure Providers present?", // 所有公共事业和私人基础设施提供商是否都在场？
        "yes": "policy_makers",
        "no": "database_a",
        "step": 1
    },
    "policy_makers": {
        "question": "Are Policy-makers & Regulators present?", // 所有政策制定者和监管者是否都在场？
        "yes": "governance",
        "no": "database_b",
        "step": 2,
        "previous": "start"
    },
    "governance": {
        "question": "Check: Are all Governance Stakeholders present?", // 检查：所有治理相关的利益相关者是否都在场？
        "yes": "innovators",
        "no": "start",
        "step": 3,
        "previous": "policy_makers"
    },
    "innovators": {
        "question": "Are Innovators & Entrepreneurs present?", // 所有创新者和企业家是否都在场？
        "yes": "investors",
        "no": "database_c",
        "step": 4,
        "previous": "governance"
    },
    "investors": {
        "question": "Are  Investors & Accelerators present?", // 所有投资者和加速器是否都在场？
        "yes": "aquapreneurship",
        "no": "database_d",
        "step": 5,
        "previous": "innovators"
    },
    "aquapreneurship": {
        "question": "Check: Are all Aquapreneurship Stakeholders present?", // 检查：所有水创业利益相关者是否都在场？
        "yes": "supporting",
        "no": "innovators",
        "step": 6,
        "previous": "investors"
    },
    "supporting": {
        "question": "Are Supporting Stakeholders present?", // 所有支持性利益相关者是否都在场？
        "yes": "intra_level",
        "no": "database_e",
        "step": 7,
        "previous": "aquapreneurship"
    },
    "intra_level": {
        "question": "Are Intra-level Governance Enablers present?", // 所有内部级治理促成者是否都在场？
        "yes": "intra_aqua",
        "no": "database_f",
        "step": 8,
        "previous": "supporting"
    },
    "intra_aqua": {
        "question": "Are Intra-level Aquapreneurship Enablers present?", // 所有内部级水创业促成者是否都在场？
        "yes": "check_intra",
        "no": "database_g",
        "step": 9,
        "previous": "intra_level"
    },
    "check_intra": {
        "question": "Check: Are all Intra-level Enablers present?", // 检查：所有内部级促成者是否都在场？
        "yes": "trans_individual",
        "no": "intra_level",
        "step": 10,
        "previous": "intra_aqua"
    },
    "trans_individual": {
        "question": "Are Trans-level Individual Enablers present?", // 所有跨级个人促成者是否都在场？
        "yes": "trans_multi",
        "no": "database_h",
        "step": 11,
        "previous": "check_intra"
    },
    "trans_multi": {
        "question": "Are Trans-level Multi-stakeholder Enablers present?", // 所有跨级多方利益相关者促成者是否都在场？
        "yes": "check_trans",
        "no": "database_j",
        "step": 12,
        "previous": "trans_individual"
    },
    "check_trans": {
        "question": "Check: Are all Trans-level Enablers present?", // 检查：所有跨级促成者是否都在场？
        "yes": "final_check",
        "no": "trans_individual",
        "step": 13,
        "previous": "trans_multi"
    },
    "final_check": {
        "question": "Are Supporting Enablers present?", // 所有支持性促成者是否都在场？
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
    
    // 设置初始标题为"Stakeholder Analysis in [城市名]"
    if(document.querySelector('.stakeholder-title')) {
        if (city === 'Any Other City') {
            document.querySelector('.stakeholder-title').textContent = `Stakeholder Analysis`;
        } else {
            document.querySelector('.stakeholder-title').textContent = `Stakeholder Analysis in ${city}`;
        }
    }
    
    // 显示对应城市的图表
    if (city === 'San Francisco') {
        if($('sfDiagram')) $('sfDiagram').style.display = 'flex';
        if($('accraDiagram')) $('accraDiagram').style.display = 'none';
        if($('singaporeDiagram')) $('singaporeDiagram').style.display = 'none';
        if($('valenciaDiagram')) $('valenciaDiagram').style.display = 'none';
        if($('anyOtherCityDiagram')) $('anyOtherCityDiagram').style.display = 'none';
    } else if (city === 'Accra') {
        if($('sfDiagram')) $('sfDiagram').style.display = 'none';
        if($('accraDiagram')) $('accraDiagram').style.display = 'flex';
        if($('singaporeDiagram')) $('singaporeDiagram').style.display = 'none';
        if($('valenciaDiagram')) $('valenciaDiagram').style.display = 'none';
        if($('anyOtherCityDiagram')) $('anyOtherCityDiagram').style.display = 'none';
    } else if (city === 'Singapore') {
        if($('sfDiagram')) $('sfDiagram').style.display = 'none';
        if($('accraDiagram')) $('accraDiagram').style.display = 'none';
        if($('singaporeDiagram')) $('singaporeDiagram').style.display = 'flex';
        if($('valenciaDiagram')) $('valenciaDiagram').style.display = 'none';
        if($('anyOtherCityDiagram')) $('anyOtherCityDiagram').style.display = 'none';
    } else if (city === 'Valencia') {
        if($('sfDiagram')) $('sfDiagram').style.display = 'none';
        if($('accraDiagram')) $('accraDiagram').style.display = 'none';
        if($('singaporeDiagram')) $('singaporeDiagram').style.display = 'none';
        if($('valenciaDiagram')) $('valenciaDiagram').style.display = 'flex';
        if($('anyOtherCityDiagram')) $('anyOtherCityDiagram').style.display = 'none';
    } else if (city === 'Any Other City') {
        if($('sfDiagram')) $('sfDiagram').style.display = 'none';
        if($('accraDiagram')) $('accraDiagram').style.display = 'none';
        if($('singaporeDiagram')) $('singaporeDiagram').style.display = 'none';
        if($('valenciaDiagram')) $('valenciaDiagram').style.display = 'none';
        if($('anyOtherCityDiagram')) $('anyOtherCityDiagram').style.display = 'flex';
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
    
    // 如果是 intra_level 状态，添加注释文本
    if (currentStakeholderState === "intra_level") {
        // 检查是否已存在注释，避免重复添加
        let noteElement = document.getElementById('intraLevelNote');
        if (!noteElement) {
            noteElement = document.createElement('p');
            noteElement.id = 'intraLevelNote';
            noteElement.style.marginTop = '15px';
            noteElement.style.fontSize = '16px';
            noteElement.style.fontStyle = 'italic';
            noteElement.style.color = 'var(--text-secondary)';
            noteElement.textContent = "Note: Intra-level Governance Enablers facilitate connections between Public Utilities & Private Infrastructure Providers and Policy-makers & Regulators.";
            $('questionText').parentNode.insertBefore(noteElement, $('questionText').nextSibling);
        }
    } else {
        // 如果不是 intra_level 状态，移除注释（如果存在）
        const noteElement = document.getElementById('intraLevelNote');
        if (noteElement) {
            noteElement.remove();
        }
    }
    
    // 如果是 intra_aqua 状态，添加注释文本
    if (currentStakeholderState === "intra_aqua") {
        // 检查是否已存在注释，避免重复添加
        let noteElement = document.getElementById('intraAquaNote');
        if (!noteElement) {
            noteElement = document.createElement('p');
            noteElement.id = 'intraAquaNote';
            noteElement.style.marginTop = '15px';
            noteElement.style.fontSize = '16px';
            noteElement.style.fontStyle = 'italic';
            noteElement.style.color = 'var(--text-secondary)';
            noteElement.textContent = "Note: Intra-level Aquapreneurship Enablers facilitate connections between Innovators & Entrepreneurs and Investors & Accelerators.";
            $('questionText').parentNode.insertBefore(noteElement, $('questionText').nextSibling);
        }
    } else {
        // 如果不是 intra_aqua 状态，移除注释（如果存在）
        const noteElement = document.getElementById('intraAquaNote');
        if (noteElement) {
            noteElement.remove();
        }
    }
    
    // 如果是 trans_individual 状态，添加注释文本
    if (currentStakeholderState === "trans_individual") {
        // 检查是否已存在注释，避免重复添加
        let noteElement = document.getElementById('transIndividualNote');
        if (!noteElement) {
            noteElement = document.createElement('div');
            noteElement.id = 'transIndividualNote';
            noteElement.style.marginTop = '15px';
            noteElement.style.fontSize = '16px';
            noteElement.style.fontStyle = 'italic';
            noteElement.style.color = 'var(--text-secondary)';
            noteElement.style.backgroundColor = '#f9f9f9';
            noteElement.style.padding = '15px';
            noteElement.style.borderRadius = '8px';
            noteElement.style.border = '1px solid #eee';
            noteElement.style.textAlign = 'left';
            
            // 创建注释内容
            noteElement.innerHTML = `
                <div>Note: Trans-level Individual Enablers facilitate connections between</div>
                <ul style="list-style-type: disc; margin-left: 20px; margin-top: 5px; margin-bottom: 0;">
                    <li>Public Utilities & Private Infrastructure Providers and Innovators & Entrepreneurs</li>
                    <li>Policy-makers & Regulators and Investors & Accelerators</li>
                </ul>
            `;
            
            $('questionText').parentNode.insertBefore(noteElement, $('questionText').nextSibling);
        }
    } else {
        // 如果不是 trans_individual 状态，移除注释（如果存在）
        const noteElement = document.getElementById('transIndividualNote');
        if (noteElement) {
            noteElement.remove();
        }
    }
    
    // 如果是 trans_multi 状态，添加注释文本
    if (currentStakeholderState === "trans_multi") {
        // 检查是否已存在注释，避免重复添加
        let noteElement = document.getElementById('transMultiNote');
        if (!noteElement) {
            noteElement = document.createElement('div');
            noteElement.id = 'transMultiNote';
            noteElement.style.marginTop = '15px';
            noteElement.style.fontSize = '16px';
            noteElement.style.fontStyle = 'italic';
            noteElement.style.color = 'var(--text-secondary)';
            noteElement.style.backgroundColor = '#f9f9f9';
            noteElement.style.padding = '15px';
            noteElement.style.borderRadius = '8px';
            noteElement.style.border = '1px solid #eee';
            noteElement.style.textAlign = 'left';
            
            // 创建注释内容
            noteElement.innerHTML = `
                <div>Note: Trans-level Multi-stakeholder Enablers facilitate connections from</div>
                <ul style="list-style-type: disc; margin-left: 20px; margin-top: 5px; margin-bottom: 0;">
                    <li>Public Utilities & Private Infrastructure Providers to All</li>
                    <li>Policy-makers & Regulators to All</li>
                    <li>Innovators & Entrepreneurs to All</li>
                    <li>Investors & Accelerators to All</li>
                    <li>All to All</li>
                </ul>
            `;
            
            $('questionText').parentNode.insertBefore(noteElement, $('questionText').nextSibling);
        }
    } else {
        // 如果不是 trans_multi 状态，移除注释（如果存在）
        const noteElement = document.getElementById('transMultiNote');
        if (noteElement) {
            noteElement.remove();
        }
    }
    
    // 更新进度
    stakeholderStep = currentState.step;
    
    // 更新标题 - 如果是第8步或之后，标题为"Enabler Analysis"，否则为"Stakeholder Analysis"
    if(document.querySelector('.stakeholder-title')) {
        // 如果是"Any Other City"选项，不显示城市名
        if (selectedCity === 'Any Other City') {
            if (currentState.step >= 8) {
                document.querySelector('.stakeholder-title').textContent = `Enabler Analysis`;
            } else {
                document.querySelector('.stakeholder-title').textContent = `Stakeholder Analysis`;
            }
        } else {
            // 其他城市保持原有逻辑
            if (currentState.step >= 8) {
                document.querySelector('.stakeholder-title').textContent = `Enabler Analysis in ${selectedCity}`;
            } else {
                document.querySelector('.stakeholder-title').textContent = `Stakeholder Analysis in ${selectedCity}`;
            }
        }
    }
    
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
    if (modal) {
        // 设置城市名称
        const cityNameSpan = document.getElementById('modalCityName');
        if (cityNameSpan) {
            cityNameSpan.textContent = selectedCity;
        }
        
        // 显示模态框
        modal.style.display = 'flex';
    }
}

function closeCompletionModal() {
    const modal = document.getElementById('completionModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 启动技术选择流程 - 从利益相关者流程转到技术选择器
function startTechnologyFlow() {
    // 关闭模态框
    closeCompletionModal();
    
    // 重置技术选择历史
    techHistory = [];
    techStep = 0;
    
    // 显示技术选择器页面
    showPage('technologySelector');
    
    // 设置技术选择器标题
    setTechHeaderTitle("Water Technology Selector");
    
    // 显示第一个技术问题
    secondTechQuestion();
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
    setTechHeaderTitle('Water-BOOST Technology Recommendation Tool');
}

// 工具函数：设置技术选择器标题
function setTechHeaderTitle(title) {
    var headerTitle = document.querySelector('#technologySelector .header h1');
    if (headerTitle) headerTitle.textContent = title;
}

// 第二个问题 - 询问是否有记录的水资源战略
function secondTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    window.currentTechQuestionFunction = "secondTechQuestion";
    $('techQuestionText').textContent = "Is there a documented water strategy at a municipal, regional, or national level?";
    window.yesFunction = "thirdTechQuestion";
    window.noFunction = "showNoWaterStrategyResult";
    // 隐藏左上角back-btn和底部Back按钮
    var backBtn = document.querySelector('.back-btn');
    if (backBtn) backBtn.style.display = 'none';
    if ($('techBackButton')) $('techBackButton').style.display = 'none';
    setTechHeaderTitle('Defining Regional Water Priority');
}

// 工具函数：在技术选择流程其它问题页显示back-btn并设置行为
function showTechBackToStage2Btn() {
    var backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.style.display = '';
        backBtn.textContent = '← Back to the beginning of Stage 2';
        backBtn.onclick = function() {
            // 重置技术流程历史和步骤
            techHistory = [];
            techStep = 1;
            // 隐藏能力选择，显示问题卡片
            if ($('capacitySelection')) $('capacitySelection').style.display = 'none';
            if ($('techQuestionCard')) $('techQuestionCard').style.display = 'block';
            if ($('resultDisplay')) $('resultDisplay').style.display = 'none';
            // 回到water strategy问题页
            secondTechQuestion();
        };
    }
}

// 第三个问题 - 询问战略是否包括明确优先级的水问题
function thirdTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    window.currentTechQuestionFunction = "thirdTechQuestion";
    $('techQuestionText').textContent = "Does the strategy include clearly ranked or funded water issues?";
    window.yesFunction = "fourthTechQuestion";
    window.noFunction = "showNoWaterPriorityResult";
    showTechBackToStage2Btn();
    setTechHeaderTitle('Defining Regional Water Priority');
}

// 第四个问题 - 询问是否有与气候和农业相关的目标
function fourthTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    window.currentTechQuestionFunction = "fourthTechQuestion";
    $('techQuestionText').textContent = "Are specific water-related goals tied to climate, agriculture or urban resilience plans?";
    window.yesFunction = "fifthTechQuestion";
    window.noFunction = "showNoWaterPriorityResult_Climate";
    showTechBackToStage2Btn();
    setTechHeaderTitle('Defining Regional Water Priority');
}

// 第五个问题 - 询问是否有利益相关者共识
function fifthTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    window.currentTechQuestionFunction = "fifthTechQuestion";
    $('techQuestionText').textContent = "Is stakeholder consensus visible around priority areas?";
    window.yesFunction = "sixthTechQuestion";
    window.noFunction = "showNoWaterPriorityResult_Consensus";
    showTechBackToStage2Btn();
    setTechHeaderTitle('Defining Regional Water Priority');
}

// 第六个问题 - 询问治理是否集中
function sixthTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    techStep++;
    window.currentTechQuestionFunction = "sixthTechQuestion";
    $('techQuestionText').textContent = "Is governance predominantly centralised (e.g., central agency or PPP)?";
    window.yesFunction = "showCapacitySelection";
    window.noFunction = "sixthBTechQuestion";
    showTechBackToStage2Btn();
    setTechHeaderTitle('Defining Governance Framework');
}

// 第六B个问题 - 询问地方权力
function sixthBTechQuestion() {
    techHistory.push(window.currentTechQuestionFunction);
    window.currentTechQuestionFunction = "sixthBTechQuestion";
    $('techQuestionText').textContent = "Is local/municipal authority empowered with budget and policy control?";
    window.yesFunction = "showCapacitySelection";
    window.noFunction = "showRebuildCapacityResult";
    showTechBackToStage2Btn();
    setTechHeaderTitle('Water-BOOST Technology Recommendation Tool');
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
        "Regional water priority is NOT clearly defined",
        "Not Defined→ Return to Stage 1\n\nRegional water priority is not defined because there is no formal strategic document to anchor decisions or align stakeholders. Without an overarching water strategy, prioritisation cannot proceed in a structured or accountable manner.\n\nConsider working with relevant authorities to develop or locate a municipal, regional, or national water strategy."
    );
}

// 显示没有水优先级的结果
function showNoWaterPriorityResult() {
    showResult(
        "Regional water priority is NOT clearly defined",
        "Not Defined→ Return to Stage 1\n\nRegional water priority is not defined because the absence of ranked or funded issues means there is no clear indication of urgency or resource commitment. Prioritisation must be grounded in structured needs and allocated budgets.\n\nConsider enhancing your strategy to include prioritised and costed water issues."
    );
}

// 显示需要重建能力的结果
function showRebuildCapacityResult() {
    showResult(
        "Rebuild capacity for decentralised governance",
        "Local or municipal authorities currently lack the policy control or financial empowerment needed to implement decentralised solutions. Strengthening institutional frameworks and enabling budget authority is essential before progressing. Therefore, return to Stage 1."
    );
}

// 显示技术推荐结果
function showResult(title, message) {
    setTechHeaderTitle('Water-BOOST Technology Recommendation Tool');
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
    titleText.textContent = title;
    titleText.style.color = '#333';
    titleText.style.margin = '10px 0';
    
    // 如果是推荐技术结果，缩小标题字体
    if (title.includes("Recommended")) {
        titleText.style.fontSize = '28px';  // 减小"Recommended Technology"字体大小
    }
    
    titleContainer.appendChild(titleText);
    
    $('resultDisplay').appendChild(titleContainer);
    
    // 如果是推荐技术结果，添加副标题显示技术名称
    if (title.includes("Recommended") && techName) {
        const subtitleElement = document.createElement('h3');
        subtitleElement.textContent = techName;
        subtitleElement.className = 'subtitle';
        subtitleElement.style.color = 'var(--primary)';
        subtitleElement.style.fontSize = '26px';  // 调整技术名称的字体大小
        subtitleElement.style.marginTop = '15px';
        subtitleElement.style.marginBottom = '20px';
        subtitleElement.style.fontWeight = '600';  // 保持字体权重，使其醒目
        subtitleElement.style.display = 'block';
        subtitleElement.style.clear = 'both';
        subtitleElement.style.textAlign = 'left';
        $('resultDisplay').appendChild(subtitleElement);
    }
    
    // 如果是特殊no water strategy内容，分段渲染
    if (message.startsWith('Not Defined→ Return to Stage 1')) {
        const msgBox = document.createElement('div');
        msgBox.style.background = '#fafbfc';
        msgBox.style.border = '2px solid rgb(10, 172, 226)';
        msgBox.style.borderRadius = '8px';
        msgBox.style.padding = '24px 28px 18px 28px';
        msgBox.style.margin = '24px 0 18px 0';
        msgBox.style.fontSize = '17px';
        msgBox.style.color = '#222';
        const lines = message.split('\n').filter(Boolean);
        lines.forEach((line, idx) => {
            if(idx === 0) {
                const strong = document.createElement('strong');
                strong.textContent = line;
                strong.style.display = 'block';
                strong.style.fontSize = '18px';
                strong.style.color = 'rgb(10, 172, 226)';
                strong.style.marginBottom = '12px';
                msgBox.appendChild(strong);
            } else {
                const p = document.createElement('p');
                p.textContent = line;
                p.style.margin = '0 0 10px 0';
                msgBox.appendChild(p);
            }
        });
        $('resultDisplay').appendChild(msgBox);
    } else {
        // 创建详细信息容器
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'tech-details';
        detailsContainer.style.backgroundColor = '#f9f9f9';
        detailsContainer.style.padding = '20px';
        detailsContainer.style.borderRadius = '8px';
        detailsContainer.style.marginTop = '20px';
        
        // 如果有详细信息，添加各项详细信息
        if (detailedInfo) {
            let alternativesAdded = false;
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
                
                // 在"What it is"和"Hype Cycle"之间添加替代技术
                if (key === "What it is" && !alternativesAdded) {
                    alternativesAdded = true;
                    addAlternativeTechnologies(detailsContainer);
                }
            }
            
            // 如果没有"What it is"字段或者其他原因导致未添加替代技术，则在此添加
            if (!alternativesAdded) {
                addAlternativeTechnologies(detailsContainer);
            }
        } else {
            // 如果没有详细信息，只显示消息文本
            const messageElem = document.createElement('p');
            messageElem.textContent = message;
            messageElem.style.margin = '0 0 20px 0';
            detailsContainer.appendChild(messageElem);
            
            // 同样添加替代技术部分
            addAlternativeTechnologies(detailsContainer);
        }
        
        // 添加Uplink Aquapreneurs部分
        addUplinkAquapreneurs(detailsContainer);
        
        $('resultDisplay').appendChild(detailsContainer);
        
        // Guidance Criteria 区块
        const guidanceBox = document.createElement('div');
        guidanceBox.className = 'guidance-criteria-box';
        guidanceBox.style.background = '#fafdff';
        guidanceBox.style.border = '1.5px solid #1ca0e3';
        guidanceBox.style.borderRadius = '10px';
        guidanceBox.style.padding = '28px 24px 22px 24px';
        guidanceBox.style.margin = '36px 0 0 0';
        guidanceBox.style.maxWidth = '900px';
        guidanceBox.style.fontSize = '16px';
        guidanceBox.style.color = '#222';
        guidanceBox.innerHTML = `
            <h2 style="color:#1ca0e3;font-size:22px;margin-bottom:12px;font-weight:600;">Guidance Criteria</h2>
            <h3 style="color:#1976D2;font-size:18px;margin-bottom:10px;font-weight:600;">Hype Cycle</h3>
            <p style="color:#555;line-height:1.7;margin-bottom:16px;">The Hype Cycle is a widely recognised model used to analyse the maturity, adoption, and application of emerging technologies
            <a href="https://www.gartner.com/en/research/methodologies/gartner-hype-cycle" target="_blank" style="color:#1ca0e3;text-decoration:underline;"></a>¹.
            It categorises innovations through five key stages:</p>
            <ol style="margin-left:18px;margin-bottom:14px;">
                <li><strong>Technology Trigger:</strong> Marks the emergence of a new technological innovation. Often initiated by breakthrough research or early proof of concept. Few functional products exist yet, but media interest starts to grow.</li>
                <li><strong>Peak of Inflated Expectations:</strong> Where initial enthusiasm and overpromising create a surge in interest in emerging technology.</li>
                <li><strong>Trough of Disillusionment:</strong> Where expectations decrease as real-world challenges emerge. Some developers stop research of technology yet improved second generation solutions have potential to emerge.</li>
                <li><strong>Slope of Enlightenment:</strong> Practical applications become clearer, more successful cases emerge due to better understanding of benefits, risks and implementation strategies
                <a href="https://ec.europa.eu/info/sites/default/files/strategic_foresight_report_2020.pdf" target="_blank" style="color:#1ca0e3;text-decoration:underline;"></a>².
                </li>
                <li><strong>Plateau of Productivity:</strong> Where the technology reaches mainstream adoption and provides measurable benefits.</li>
            </ol>
            <div style="margin-top: 20px;">
                <h2> References: </h2>
                <ol style="margin-left:18px;margin-bottom:14px;">
                    <li> Gartner (2023). Understanding Gartner's Hype Cycle. Available at: <a style="color:#1ca0e3;text-decoration:underline;" href="https://www.gartner.com/en/research/methodologies/gartner-hype-cycle" target="_blank">https://www.gartner.com/en/research/methodologies/gartner-hype-cycle </a>(Accessed: 14 May 2025)</li>
                    <li> European Commission (2020). Strategic Foresight Report 2020. Available at: <a style="color:#1ca0e3;text-decoration:underline;" href="https://ec.europa.eu/info/sites/default/files/strategic_foresight_report_2020.pdf" target="_blank">https://ec.europa.eu/info/sites/default/files/strategic_foresight_report_2020.pdf </a>(Accessed: 14 May 2025)</li>
                </ol>
             </div>
             <div style="margin-top: 20px;">
               <img src="./WechatIMG632.jpg" alt="Hype Cycle" style="width: 100%; height: auto;">
             </div>
               <div class="guidance-criteria">
                    <h2>Cost Matrix</h2>
                
                    <table class="criteria-table">
                        <tr>
                            <th></th>
                            <th>Low</th>
                            <th>Moderate</th>
                            <th>High</th>
                        </tr>
                        <tr>
                            <td>Cost of Adoption</td>
                            <td><$50,000³
                            <p>Often donor-funded, minimal setup</p>
                            </td>
                            <td>$50,000 – $500,000 
                            <p>Moderate infrastructure, scalable kits</p>
                            </td>
                            <td> >$500,000⁴
                            <p>High capital, advanced digital systems</p>
                             </td>
                        </tr>
                    </table>
                    <div style="margin-top: 20px;">
                     <p>3. OECD (2022). Financing Water Supply, Sanitation and Flood Protection: Challenges in EU Member States and Policy Options. Available at: <a style="color:#1ca0e3;text-decoration:underline;" href="https://www.oecd.org/water/financing-water-supply-sanitation.html" target="_blank">https://www.oecd.org/water/financing-water-supply-sanitation.html </a>(Accessed: 14 May 2025)</p>
                     <p>4. World Bank (2021). Costing Water Services for Effective Utility Management. Available at:  <a style="color:#1ca0e3;text-decoration:underline;" href="https://www.worldbank.org/en/topic/water/publication/costing-water-services" target="_blank">https://www.worldbank.org/en/topic/water/publication/costing-water-services </a>(Accessed: 14 May 2025)</p>
                    </div>
                       <h2>Time Matrix</h2>
                         <table class="criteria-table">
                        <tr>
                            <th></th>
                            <th>Short</th>
                            <th>Medium</th>
                            <th>Long</th>
                        </tr>
                        <tr>
                            <td>Implementation Timeline</td>
                            <td><12 months⁵
                            <p>Deployable with minimal approva</p>
                            
                             </td>
                            <td>12–36 months
                            <p>Depends on permitting, integration, or scaling</p>
                             </td>
                            <td> >36 months⁶ 
                            <p>Complex design, construction, and integration</p>
                            </td>
                        </tr>
                    </table>
                       <div style="margin-top: 20px;">
                     <p>5. UN Water (2020). Water and Sanitation: Implementation Progress and Lessons Learned. Available at: <a style="color:#1ca0e3;text-decoration:underline;" href="https://www.unwater.org/publications " target="_blank">https://www.unwater.org/publications </a>(Accessed: 14 May 2025)</p>
                     <p>6. World Health Organization (WHO) (2017). Guidelines for Drinking-Water Quality: Implementation Framework. Available at: <a style="color:#1ca0e3;text-decoration:underline;" href="https://www.who.int/publications/i/item/9789241549950" target="_blank">https://www.who.int/publications/i/item/9789241549950 </a>(Accessed: 14 May 2025)</p>
                    </div>
                </div>
        `;
        $('resultDisplay').appendChild(guidanceBox);
    }
    
    // 添加操作按钮
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '30px';
    
    const actionBtn = document.createElement('button');
    actionBtn.className = 'modern-button primary';
    // 判断不同情况
    if (
        title === 'Moderate capacity not aligned to current priority.' ||
        title === 'High capacity system does not meet tech criteria.'
    ) {
        actionBtn.textContent = 'Go Back to Capacity Pathway';
        actionBtn.onclick = showCapacitySelection;
    } else if (
        title === 'Low capacity systems require foundational support.' ||
        (typeof message === 'string' && (
            message.includes('To proceed, return to the start of the tool') ||
            message.startsWith('Not Defined→ Return to Stage 1') ||
            message.trim().endsWith('Therefore, return to Stage 1.')
        ))
    ) {
        // 对于需要返回Stage 1的情况，显示"Back to the beginning of Stage 2"和"Start Over"按钮
        const backToStage2Button = document.createElement('button');
        backToStage2Button.className = 'modern-button secondary';
        backToStage2Button.textContent = 'Back to the beginning of Stage 2';
        backToStage2Button.style.marginRight = '15px';
        backToStage2Button.onclick = function() {
            // 重置技术流程历史和步骤
            techHistory = [];
            techStep = 1;
            // 隐藏能力选择，显示问题卡片
            if ($('capacitySelection')) $('capacitySelection').style.display = 'none';
            if ($('techQuestionCard')) $('techQuestionCard').style.display = 'block';
            if ($('resultDisplay')) $('resultDisplay').style.display = 'none';
            // 回到water strategy问题页
            secondTechQuestion();
        };
        buttonContainer.appendChild(backToStage2Button);
        
        actionBtn.textContent = 'Start Over';
        actionBtn.onclick = function() {
            window.location.reload();
        };
    } else {
        actionBtn.textContent = 'Go Back to Capacity Pathway';
        actionBtn.onclick = showCapacitySelection;
        
        // 添加Start Over按钮
        const startOverBtn = document.createElement('button');
        startOverBtn.className = 'modern-button primary';
        startOverBtn.textContent = 'Start Over';
        startOverBtn.style.marginLeft = '15px';
        startOverBtn.onclick = function() {
            window.location.reload();
        };
        buttonContainer.appendChild(actionBtn);
        buttonContainer.appendChild(startOverBtn);
        
        // 已经添加了两个按钮，直接返回
        $('resultDisplay').appendChild(buttonContainer);
        return;
    }
    buttonContainer.appendChild(actionBtn);
    $('resultDisplay').appendChild(buttonContainer);
}

// 添加替代技术部分的函数
function addAlternativeTechnologies(container) {
    const alternativesItem = document.createElement('div');
    alternativesItem.style.marginBottom = '15px';
    alternativesItem.style.display = 'flex';
    alternativesItem.style.alignItems = 'flex-start';
    
    // 添加图标
    const altIcon = document.createElement('span');
    altIcon.style.marginRight = '10px';
    altIcon.style.fontSize = '20px';
    altIcon.textContent = "🔄";
    alternativesItem.appendChild(altIcon);
    
    // 添加详细文本
    const altTextContent = document.createElement('div');
    const altLabel = document.createElement('strong');
    altLabel.textContent = "Alternative and complementary technologies: ";
    altTextContent.appendChild(altLabel);
    
    // 添加换行和列表
    const altList = document.createElement('ul');
    altList.style.marginTop = '5px';
    altList.style.paddingLeft = '20px';
    
    // 为所有技术添加相同的替代技术
    const altItems = [
        "AI-Powered Smart Grids",
        "Real Time Water Quality Monitoring Sensors"
    ];
    
    // 为每个替代技术创建列表项
    altItems.forEach(item => {
        const altItem = document.createElement('li');
        altItem.textContent = item;
        altList.appendChild(altItem);
    });
    
    altTextContent.appendChild(altList);
    alternativesItem.appendChild(altTextContent);
    container.appendChild(alternativesItem);
}

// 添加Uplink Aquapreneurs部分的函数
function addUplinkAquapreneurs(container) {
    const uplinkItem = document.createElement('div');
    uplinkItem.style.marginBottom = '15px';
    uplinkItem.style.marginTop = '20px';
    uplinkItem.style.display = 'flex';
    uplinkItem.style.alignItems = 'flex-start';
    
    // 添加图标
    const uplinkIcon = document.createElement('span');
    uplinkIcon.style.marginRight = '10px';
    uplinkIcon.style.fontSize = '20px';
    uplinkIcon.textContent = "🚀";
    uplinkItem.appendChild(uplinkIcon);
    
    // 添加详细文本
    const uplinkTextContent = document.createElement('div');
    const uplinkLabel = document.createElement('strong');
    uplinkLabel.textContent = "Uplink Aquapreneurs deploying these technologies: ";
    uplinkTextContent.appendChild(uplinkLabel);
    
    // 添加换行和列表
    const uplinkList = document.createElement('ul');
    uplinkList.style.marginTop = '5px';
    uplinkList.style.paddingLeft = '20px';
    uplinkList.className = 'uplink-companies'; // 添加类名，用于CSS样式
    
    // 为所有技术添加相同的公司列表
    const companies = [
        { name: "RainGrid Inc.", url: "https://www.raingrid.com" },
        { name: "SmartTerra", url: "https://www.smartterra.io" },
        { name: "PYDRO", url: "https://www.pydro.com" }
    ];
    
    companies.forEach(company => {
        const companyItem = document.createElement('li');
        const companyLink = document.createElement('a');
        companyLink.textContent = company.name;
        companyLink.href = company.url;
        companyLink.target = "_blank";
        // 移除这些内联样式，让CSS文件控制样式
        // companyLink.style.color = "#333";
        // companyLink.style.textDecoration = "none";
        companyItem.appendChild(companyLink);
        uplinkList.appendChild(companyItem);
    });
    
    uplinkTextContent.appendChild(uplinkList);
    uplinkItem.appendChild(uplinkTextContent);
    container.appendChild(uplinkItem);
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
        "Largescale Wastewater Recycling/Desalination": {
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
        "Smart Irrigation and Internet of Things (IoT)": {
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

// 显示数据库信息 - 展示缺失的利益相关者和城市指标数据
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
    // 城市名到 key 的映射
    const cityKeyMap = {
        'San Francisco': 'sf',
        'Accra': 'accra',
        'Singapore': 'singapore',
        'Valencia': 'valencia'
    };
    
    // 获取当前选中城市的 key，Any Other City 不需要添加到数据库显示中
    let selectedCityKey = cityKeyMap[selectedCity];
    
    // 固定的城市顺序，Any Other City 不参与显示
    const fixedCityKeys = ['sf', 'accra', 'singapore', 'valencia'];
    let cityKeys;
    
    if (selectedCity === 'Any Other City') {
        // Any Other City 选项时，只显示其他四个城市，不需要调整顺序
        cityKeys = fixedCityKeys;
    } else {
        // 让选中城市排在第一个，其余顺序不变
        cityKeys = [selectedCityKey, ...fixedCityKeys.filter(key => key !== selectedCityKey)];
    }
    
    // id 映射
    const cityIdMap = {
        'sf': {name: 'San Francisco', list: 'sfCityList', title: 'sfCityName'},
        'accra': {name: 'Accra', list: 'accraCityList', title: 'accraCityName'},
        'singapore': {name: 'Singapore', list: 'singaporeCityList', title: 'singaporeCityName'},
        'valencia': {name: 'Valencia', list: 'valenciaCityList', title: 'valenciaCityName'}
    };
    // --- 城市比较区域 ---
    // 重新排序城市比较区域
    const cityComparisonGrid = document.querySelector('.city-comparison.city-comparison-grid');
    if (cityComparisonGrid) {
        // 先收集所有city-data节点
        const cityDataNodes = {};
        cityKeys.forEach(key => {
            const node = document.getElementById(`${key}CityData`);
            if (node) cityDataNodes[key] = node;
        });
        // 清空原有内容
        cityComparisonGrid.innerHTML = '';
        // 按新顺序插入
        cityKeys.forEach(key => {
            if (cityDataNodes[key]) cityComparisonGrid.appendChild(cityDataNodes[key]);
        });
    }
    // --- 城市指标表格 ---
    // 重新排序城市指标表格
    const metricsTablesContainer = document.querySelector('.city-metrics-tables');
    if (metricsTablesContainer) {
        // 收集所有.city-metrics-table
        const allTables = Array.from(metricsTablesContainer.querySelectorAll('.city-metrics-table'));
        // 建立城市名到table的映射
        const tableMap = {};
        allTables.forEach(table => {
            const h3 = table.querySelector('h3');
            if (h3) tableMap[h3.textContent.trim()] = table;
        });
        // 清空原有内容
        metricsTablesContainer.innerHTML = '';
        // 按新顺序插入
        cityKeys.forEach(key => {
            const cityName = cityIdMap[key].name;
            if (tableMap[cityName]) metricsTablesContainer.appendChild(tableMap[cityName]);
        });
    }
    // --- 内容渲染和高亮逻辑保持不变 ---
    cityKeys.forEach(key => {
        const cityData = databaseContent[key] || [];
        const listId = cityIdMap[key].list;
        const titleId = cityIdMap[key].title;
        // 清空
        $(listId).innerHTML = '';
        // 渲染内容
        if (cityData.length > 0) {
            cityData.forEach(item => {
                // 检查是否是标题（数字+点开头）
                if (/^\d+\./.test(item.trim())) {
                    // 创建h3标题元素
                    const h3 = document.createElement('h3');
                    h3.textContent = item;
                    h3.style.margin = '15px 0 10px 0';
                    h3.style.color = '#555';
                    h3.style.fontSize = '16px';
                    h3.style.fontWeight = '700';
                    $(listId).appendChild(h3);
                } else {
                    // 常规列表项
                    const li = document.createElement('li');
                    li.textContent = item;
                    // 子项样式
                    if (item.trim().startsWith('→')) li.classList.add('subitem');
                    $(listId).appendChild(li);
                }
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No data available';
            li.className = 'no-data';
            $(listId).appendChild(li);
        }
        
        // 高亮所选城市，但Any Other City选项不高亮任何城市
        const titleElem = $(titleId);
        if (selectedCity !== 'Any Other City' && selectedCityKey === key) {
            titleElem.classList.add('selected');
        } else {
            titleElem.classList.remove('selected');
        }
        
        // 高亮城市指标表格的h3标题
        const metricsTables = document.querySelectorAll('.city-metrics-table');
        metricsTables.forEach(table => {
            const h3 = table.querySelector('h3');
            if (!h3) return;
            if (h3.textContent.trim() === cityIdMap[key].name) {
                if (selectedCity !== 'Any Other City' && selectedCityKey === key) {
                    h3.classList.add('selected');
                } else {
                    h3.classList.remove('selected');
                }
            }
        });
    });
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
    if (selectedCity === 'Any Other City') {
        $('questionText').textContent = "Congratulations! All stakeholders are present for water technology innovation. You can now proceed to the Technology Selector.";
    } else {
        $('questionText').textContent = "Congratulations! All stakeholders are present for water technology innovation in " + selectedCity + ". You can now proceed to the Technology Selector.";
    }
    
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
        "Recommended Technology",
        "Digital Twin Technology"
    );
    
    // 在结果显示后，检查并添加特定的替代技术和公司信息
    setTimeout(() => {
        const resultDisplay = document.getElementById('resultDisplay');
        if (resultDisplay) {
            // 查找替代技术部分
            let alternativeSection = null;
            const sections = resultDisplay.querySelectorAll('.tech-details > div');
            for (const section of sections) {
                if (section.textContent.includes('Alternative and complementary technologies')) {
                    alternativeSection = section;
                    break;
                }
            }
            
            // 如果找到替代技术部分，更新其内容
            if (alternativeSection) {
                const altList = alternativeSection.querySelector('ul');
                if (altList) {
                    // 清空现有列表
                    altList.innerHTML = '';
                    
                    // 添加特定的替代技术
                    const altItems = [
                        "AI-Powered Smart Grids",
                        "Real Time Water Quality Monitoring Sensors"
                    ];
                    
                    altItems.forEach(item => {
                        const altItem = document.createElement('li');
                        altItem.textContent = item;
                        altList.appendChild(altItem);
                    });
                }
            }
            
            // 查找Uplink Aquapreneurs部分
            let uplinkSection = null;
            for (const section of sections) {
                if (section.textContent.includes('Uplink Aquapreneurs deploying these technologies')) {
                    uplinkSection = section;
                    break;
                }
            }
            
            // 如果找到Uplink Aquapreneurs部分，更新其内容
            if (uplinkSection) {
                const uplinkList = uplinkSection.querySelector('ul');
                if (uplinkList) {
                    // 清空现有列表
                    uplinkList.innerHTML = '';
                    
                    // 添加特定的公司
                    const companies = [
                        { name: "RainGrid Inc.", url: "https://www.raingrid.com" },
                        { name: "SmartTerra", url: "https://www.smartterra.io" },
                        { name: "PYDRO", url: "https://www.pydro.com" }
                    ];
                    
                    companies.forEach(company => {
                        const companyItem = document.createElement('li');
                        const companyLink = document.createElement('a');
                        companyLink.textContent = company.name;
                        companyLink.href = company.url;
                        companyLink.target = "_blank";
                        companyLink.style.color = "#333";
                        companyLink.style.textDecoration = "none";
                        companyItem.appendChild(companyLink);
                        uplinkList.appendChild(companyItem);
                    });
                }
            }
        }
    }, 100);
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
        "Recommended Technology",
        "Largescale Wastewater Recycling/Desalination"
    );
    
    // 在结果显示后，检查并添加特定的替代技术和公司信息
    setTimeout(() => {
        const resultDisplay = document.getElementById('resultDisplay');
        if (resultDisplay) {
            // 查找替代技术部分
            let alternativeSection = null;
            const sections = resultDisplay.querySelectorAll('.tech-details > div');
            for (const section of sections) {
                if (section.textContent.includes('Alternative and complementary technologies')) {
                    alternativeSection = section;
                    break;
                }
            }
            
            // 如果找到替代技术部分，更新其内容
            if (alternativeSection) {
                const altList = alternativeSection.querySelector('ul');
                if (altList) {
                    // 清空现有列表
                    altList.innerHTML = '';
                    
                    // 添加特定的替代技术
                    const altItems = [
                        "Bioelectrochemical Systems",
                        "Advanced Oxidation Processes",
                        "Supercritical Water Oxidation",
                        "Membrane Distillation"
                    ];
                    
                    altItems.forEach(item => {
                        const altItem = document.createElement('li');
                        altItem.textContent = item;
                        altList.appendChild(altItem);
                    });
                }
            }
            
            // 查找Uplink Aquapreneurs部分
            let uplinkSection = null;
            for (const section of sections) {
                if (section.textContent.includes('Uplink Aquapreneurs deploying these technologies')) {
                    uplinkSection = section;
                    break;
                }
            }
            
            // 如果找到Uplink Aquapreneurs部分，更新其内容
            if (uplinkSection) {
                const uplinkList = uplinkSection.querySelector('ul');
                if (uplinkList) {
                    // 清空现有列表
                    uplinkList.innerHTML = '';
                    
                    // 添加特定的公司
                    const companies = [
                        { name: "Epic Cleantec", url: "https://epiccleantec.com" },
                        { name: "FieldFactors", url: "https://www.fieldfactors.com" },
                        { name: "Syrinx", url: "https://www.syrinx.net.au" }
                    ];
                    
                    companies.forEach(company => {
                        const companyItem = document.createElement('li');
                        const companyLink = document.createElement('a');
                        companyLink.textContent = company.name;
                        companyLink.href = company.url;
                        companyLink.target = "_blank";
                        companyLink.style.color = "#333";
                        companyLink.style.textDecoration = "none";
                        companyItem.appendChild(companyLink);
                        uplinkList.appendChild(companyItem);
                    });
                }
            }
        }
    }, 100);
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
        "Recommended Technology",
        "AI Leak Detection"
    );
    
    // 在结果显示后，检查并添加特定的替代技术和公司信息
    setTimeout(() => {
        const resultDisplay = document.getElementById('resultDisplay');
        if (resultDisplay) {
            // 查找替代技术部分
            let alternativeSection = null;
            const sections = resultDisplay.querySelectorAll('.tech-details > div');
            for (const section of sections) {
                if (section.textContent.includes('Alternative and complementary technologies')) {
                    alternativeSection = section;
                    break;
                }
            }
            
            // 如果找到替代技术部分，更新其内容
            if (alternativeSection) {
                const altList = alternativeSection.querySelector('ul');
                if (altList) {
                    // 清空现有列表
                    altList.innerHTML = '';
                    
                    // 添加特定的替代技术
                    const altItems = [
                        "AI-Powered Smart Grids",
                        "Electrocoagulation"
                    ];
                    
                    altItems.forEach(item => {
                        const altItem = document.createElement('li');
                        altItem.textContent = item;
                        altList.appendChild(altItem);
                    });
                }
            }
            
            // 查找Uplink Aquapreneurs部分
            let uplinkSection = null;
            for (const section of sections) {
                if (section.textContent.includes('Uplink Aquapreneurs deploying these technologies')) {
                    uplinkSection = section;
                    break;
                }
            }
            
            // 如果找到Uplink Aquapreneurs部分，更新其内容
            if (uplinkSection) {
                const uplinkList = uplinkSection.querySelector('ul');
                if (uplinkList) {
                    // 清空现有列表
                    uplinkList.innerHTML = '';
                    
                    // 添加特定的公司
                    const companies = [
                        { name: "Shayp", url: "https://www.shayp.com" },
                        { name: "SmartTerra", url: "https://www.smartterra.io" }
                    ];
                    
                    companies.forEach(company => {
                        const companyItem = document.createElement('li');
                        const companyLink = document.createElement('a');
                        companyLink.textContent = company.name;
                        companyLink.href = company.url;
                        companyLink.target = "_blank";
                        companyLink.style.color = "#333";
                        companyLink.style.textDecoration = "none";
                        companyItem.appendChild(companyLink);
                        uplinkList.appendChild(companyItem);
                    });
                }
            }
        }
    }, 100);
}

function showHighCapacityNoMatchResult() {
    showResult(
        "High capacity system does not meet tech criteria.",
        "High-capacity systems may lack readiness specific to your scenario. Please click the following button and consider the moderate capacity pathway instead."
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
        "Recommended Technology",
        "Smart Irrigation and Internet of Things (IoT)"
    );
    
    // 在结果显示后，检查并添加特定的替代技术和公司信息
    setTimeout(() => {
        const resultDisplay = document.getElementById('resultDisplay');
        if (resultDisplay) {
            // 查找替代技术部分
            let alternativeSection = null;
            const sections = resultDisplay.querySelectorAll('.tech-details > div');
            for (const section of sections) {
                if (section.textContent.includes('Alternative and complementary technologies')) {
                    alternativeSection = section;
                    break;
                }
            }
            
            // 如果找到替代技术部分，更新其内容
            if (alternativeSection) {
                const altList = alternativeSection.querySelector('ul');
                if (altList) {
                    // 清空现有列表
                    altList.innerHTML = '';
                    
                    // 添加特定的替代技术
                    const altItems = [
                        "Hydrogel Based Water Harvesting",
                        "Capacitive Deionisation (CDI)",
                        "Real Time Water Quality Monitoring Sensors"
                    ];
                    
                    altItems.forEach(item => {
                        const altItem = document.createElement('li');
                        altItem.textContent = item;
                        altList.appendChild(altItem);
                    });
                }
            }
            
            // 查找Uplink Aquapreneurs部分
            let uplinkSection = null;
            for (const section of sections) {
                if (section.textContent.includes('Uplink Aquapreneurs deploying these technologies')) {
                    uplinkSection = section;
                    break;
                }
            }
            
            // 如果找到Uplink Aquapreneurs部分，更新其内容
            if (uplinkSection) {
                const uplinkList = uplinkSection.querySelector('ul');
                if (uplinkList) {
                    // 清空现有列表
                    uplinkList.innerHTML = '';
                    
                    // 添加特定的公司
                    const companies = [
                        { name: "Kilimo", url: "https://kilimo.com/en/" },
                        { name: "SEABEX SAS", url: "https://seabex.com" },
                        { name: "Spowdi", url: "https://spowdi.com/" }
                    ];
                    
                    companies.forEach(company => {
                        const companyItem = document.createElement('li');
                        const companyLink = document.createElement('a');
                        companyLink.textContent = company.name;
                        companyLink.href = company.url;
                        companyLink.target = "_blank";
                        companyLink.style.color = "#333";
                        companyLink.style.textDecoration = "none";
                        companyItem.appendChild(companyLink);
                        uplinkList.appendChild(companyItem);
                    });
                }
            }
        }
    }, 100);
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
        "Recommended Technology",
        "Nature-Based Solutions"
    );
    
    // 在结果显示后，检查并添加特定的替代技术和公司信息
    setTimeout(() => {
        const resultDisplay = document.getElementById('resultDisplay');
        if (resultDisplay) {
            // 查找替代技术部分
            let alternativeSection = null;
            const sections = resultDisplay.querySelectorAll('.tech-details > div');
            for (const section of sections) {
                if (section.textContent.includes('Alternative and complementary technologies')) {
                    alternativeSection = section;
                    break;
                }
            }
            
            // 如果找到替代技术部分，更新其内容
            if (alternativeSection) {
                const altList = alternativeSection.querySelector('ul');
                if (altList) {
                    // 清空现有列表
                    altList.innerHTML = '';
                    
                    // 添加特定的替代技术
                    const altItems = [
                        "Floating Treatment Wetlands",
                        "Rainwater Harvesting Systems",
                        "Photo Thermal Umbrella for Solar Evaporation"
                    ];
                    
                    altItems.forEach(item => {
                        const altItem = document.createElement('li');
                        altItem.textContent = item;
                        altList.appendChild(altItem);
                    });
                }
            }
            
            // 查找Uplink Aquapreneurs部分
            let uplinkSection = null;
            for (const section of sections) {
                if (section.textContent.includes('Uplink Aquapreneurs deploying these technologies')) {
                    uplinkSection = section;
                    break;
                }
            }
            
            // 如果找到Uplink Aquapreneurs部分，更新其内容
            if (uplinkSection) {
                const uplinkList = uplinkSection.querySelector('ul');
                if (uplinkList) {
                    // 清空现有列表
                    uplinkList.innerHTML = '';
                    
                    // 添加特定的公司
                    const companies = [
                        { name: "Syrinx", url: "https://www.syrinx.net.au" }
                    ];
                    
                    companies.forEach(company => {
                        const companyItem = document.createElement('li');
                        const companyLink = document.createElement('a');
                        companyLink.textContent = company.name;
                        companyLink.href = company.url;
                        companyLink.target = "_blank";
                        companyLink.style.color = "#333";
                        companyLink.style.textDecoration = "none";
                        companyItem.appendChild(companyLink);
                        uplinkList.appendChild(companyItem);
                    });
                }
            }
        }
    }, 100);
}

function showModerateCapacityNoMatchResult() {
    showResult(
        "Moderate capacity not aligned to current priority.",
        "Moderate capacity is not suitable for addressing the given priority. Please click the following button to reassess capacity conditions or clarify the regional priority for a suitable technology to be recommended."
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
        "Recommended Technology",
        "Decentralised Water Treatment Systems"
    );
    
    // 在结果显示后，检查并添加特定的替代技术和公司信息
    setTimeout(() => {
        const resultDisplay = document.getElementById('resultDisplay');
        if (resultDisplay) {
            // 查找替代技术部分
            let alternativeSection = null;
            const sections = resultDisplay.querySelectorAll('.tech-details > div');
            for (const section of sections) {
                if (section.textContent.includes('Alternative and complementary technologies')) {
                    alternativeSection = section;
                    break;
                }
            }
            
            // 如果找到替代技术部分，更新其内容
            if (alternativeSection) {
                const altList = alternativeSection.querySelector('ul');
                if (altList) {
                    // 清空现有列表
                    altList.innerHTML = '';
                    
                    // 添加特定的替代技术
                    const altItems = [
                        "Forward Osmosis",
                        "Solar Powered Desalination",
                        "Electrocoagulation"
                    ];
                    
                    altItems.forEach(item => {
                        const altItem = document.createElement('li');
                        altItem.textContent = item;
                        altList.appendChild(altItem);
                    });
                }
            }
            
            // 查找Uplink Aquapreneurs部分
            let uplinkSection = null;
            for (const section of sections) {
                if (section.textContent.includes('Uplink Aquapreneurs deploying these technologies')) {
                    uplinkSection = section;
                    break;
                }
            }
            
            // 如果找到Uplink Aquapreneurs部分，更新其内容
            if (uplinkSection) {
                const uplinkList = uplinkSection.querySelector('ul');
                if (uplinkList) {
                    // 清空现有列表
                    uplinkList.innerHTML = '';
                    
                    // 添加特定的公司
                    const companies = [
                        { name: "Indra Water", url: "https://www.indrawater.com" },
                        { name: "Openversum", url: "https://www.openversum.com" },
                        { name: "WASE", url: "https://wase.co.uk" }
                    ];
                    
                    companies.forEach(company => {
                        const companyItem = document.createElement('li');
                        const companyLink = document.createElement('a');
                        companyLink.textContent = company.name;
                        companyLink.href = company.url;
                        companyLink.target = "_blank";
                        companyLink.style.color = "#333";
                        companyLink.style.textDecoration = "none";
                        companyItem.appendChild(companyLink);
                        uplinkList.appendChild(companyItem);
                    });
                }
            }
        }
    }, 100);
}

function showLowCapacityNoMatchResult() {
    showResult(
        "Low capacity systems require foundational support.",
        "Current systems lack the institutional, technical, or financial foundations needed to adopt or sustain water technologies. Please focus on building basic governance structures, securing external support (e.g., NGOs, grants), and strengthening local capacity. To proceed, return to the start of the tool and reassess enabling conditions under Stage 1."
    );
}

// 显示没有水优先级的结果
function showNoWaterPriorityResult_Climate() {
    showResult(
        "Regional water priority is NOT clearly defined",
        "Not Defined→ Return to Stage 1\n\nRegional water priority is not defined because isolated water goals cannot be meaningfully implemented without integration into broader sectoral plans. Interlinking water with climate, agriculture or urban frameworks ensures impact and coherence.\n\nConsider aligning water goals with national or regional resilience, agriculture, or climate frameworks."
    );
}

// 显示没有水优先级的结果
function showNoWaterPriorityResult_Consensus() {
    showResult(
        "Regional water priority is NOT clearly defined",
        "Not Defined→ Return to Stage 1\n\nRegional water priority is not defined because without stakeholder agreement, priorities lack legitimacy and risk poor adoption of emerging technology. Consensus ensures alignment, user engagement and relevance to local needs.\n\nConsider facilitating multi-stakeholder dialogues to co-develop shared water priorities."
    );
}

// 显示没有地方权力结果
function showNoDecentralisedGovernanceResult() {
    showResult(
        "Rebuild capacity for decentralised governance",
        "Local or municipal authorities currently lack the policy control or financial empowerment needed to implement decentralised solutions. Strengthening institutional frameworks and enabling budget authority is essential before progressing. Therefore, return to Stage 1."
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