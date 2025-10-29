// 生徒用テスト機能
const units = JSON.parse(localStorage.getItem("units")||"{}");
let quizWords=[], currentWord=null, wrongAnswers=[], currentUnit=null, showAnswerNext=false, totalQuestions=0;

function setupUnits(){
    const select = document.getElementById("unitSelect");
    select.innerHTML="";
    Object.keys(units).forEach(u=>{
        const opt=document.createElement("option");
        opt.value=u;
        opt.textContent=u;
        select.appendChild(opt);
    });
}

function startQuiz(){
    const select = document.getElementById("unitSelect");
    const unit = select.value;
    if(!unit){ alert("単元を選んでください"); return; }
    currentUnit = unit;
    quizWords = Object.entries(units[unit]);
    wrongAnswers = [];
    totalQuestions = quizWords.length;
    document.getElementById("unitArea").classList.add("hidden");
    document.getElementById("testArea").classList.remove("hidden");
    document.getElementById("wrongList").classList.add("hidden");
    nextQuestion();
}

function nextQuestion(){
    if(quizWords.length===0){ showWrongList(); return; }
    const idx = Math.floor(Math.random()*quizWords.length);
    currentWord = quizWords.splice(idx,1)[0];
    showAnswerNext = false;
    document.getElementById("quizWord").innerText = currentWord[1];
    document.getElementById("answer").value="";
    document.getElementById("result").innerText="";
    document.getElementById("remaining").innerText = `残り ${quizWords.length + 1} 問`;
    document.getElementById("answer").focus();
}

document.getElementById("answer").addEventListener("keydown", e=>{
    if(e.key==="Enter"){
        if(!showAnswerNext){
            checkAnswer();
            showAnswerNext=true;
        }else{
            nextQuestion();
        }
    }
});

function checkAnswer(){
    const userAnswer = document.getElementById("answer").value.trim();
    const correctAnswer = currentWord[0];
    const result = document.getElementById("result");
    if(userAnswer.toLowerCase() === correctAnswer.toLowerCase()){
        result.innerText = "⭕ 正解！";
    }else{
        result.innerText = `❌ 不正解（正答：${correctAnswer}）`;
        wrongAnswers.push({word:currentWord[1], answer:correctAnswer});
    }
}

function endQuiz(){ showWrongList(); }

function showWrongList(){
    document.getElementById("testArea").classList.add("hidden");
    document.getElementById("wrongList").classList.remove("hidden");

    const list = document.getElementById("wrongWords");
    list.innerHTML = "";
    if(wrongAnswers.length===0) list.innerHTML = "<li>間違いはありません！</li>";
    else wrongAnswers.forEach(item=>{
        const li = document.createElement("li");
        li.textContent = `${item.word} → ${item.answer}`;
        list.appendChild(li);
    });

    const score = document.getElementById("score");
    const correctCount = totalQuestions - wrongAnswers.length;
    const rate = ((correctCount/totalQuestions)*100).toFixed(1);
    score.innerText = `正答率：${correctCount} / ${totalQuestions} = ${rate}%`;
}

function restartQuiz(){
    document.getElementById("wrongList").classList.add("hidden");
    document.getElementById("unitArea").classList.remove("hidden");
}

setupUnits();