const list=document.getElementById("problemList")
const loadBtn=document.getElementById("loadBtn")
const filter=document.getElementById("difficultyFilter")
const search=document.getElementById("searchInput")
const randomBtn=document.getElementById("randomBtn")

const totalSolved=document.getElementById("totalSolved")
const easyCount=document.getElementById("easyCount")
const mediumCount=document.getElementById("mediumCount")
const hardCount=document.getElementById("hardCount")
const progressBar=document.getElementById("progressBar")

let problems=[]
let solved=JSON.parse(localStorage.getItem("solved"))||{}

async function loadProblems(){

const res=await fetch("problems.json")
problems=await res.json()

render()

}

function updateStats(){

let solvedCount=0
let easy=0
let medium=0
let hard=0

for(let p of problems){

if(solved[p.titleSlug]){

solvedCount++

if(p.difficulty==="Easy")easy++
if(p.difficulty==="Medium")medium++
if(p.difficulty==="Hard")hard++

}

}

totalSolved.textContent=solvedCount+" / "+problems.length
easyCount.textContent=easy
mediumCount.textContent=medium
hardCount.textContent=hard

let percent=(solvedCount/problems.length)*100||0
progressBar.style.width=percent+"%"

}

function render(){

list.innerHTML=""

const diffFilter=filter.value
const searchText=search.value.toLowerCase()

for(let p of problems){

if(diffFilter!=="all" && p.difficulty!==diffFilter)continue
if(!p.title.toLowerCase().includes(searchText))continue

const li=document.createElement("li")

const left=document.createElement("div")
left.className="problem-left"

const checkbox=document.createElement("input")
checkbox.type="checkbox"
checkbox.checked=solved[p.titleSlug]

checkbox.onchange=function(){

solved[p.titleSlug]=checkbox.checked
localStorage.setItem("solved",JSON.stringify(solved))
render()

}

const title=document.createElement("span")
title.textContent=p.title

if(checkbox.checked)title.classList.add("solved")

left.appendChild(checkbox)
left.appendChild(title)

const diff=document.createElement("span")
diff.textContent=p.difficulty

if(p.difficulty==="Easy")diff.classList.add("easyText")
if(p.difficulty==="Medium")diff.classList.add("mediumText")
if(p.difficulty==="Hard")diff.classList.add("hardText")

const link=document.createElement("a")
link.href="https://leetcode.com/problems/"+p.titleSlug
link.target="_blank"
link.textContent="Open"

li.appendChild(left)
li.appendChild(diff)
li.appendChild(link)

list.appendChild(li)

}

updateStats()

}

function randomProblem(){

if(problems.length===0){
alert("Load problems first")
return
}

const random=problems[Math.floor(Math.random()*problems.length)]

window.open("https://leetcode.com/problems/"+random.titleSlug)

}

loadBtn.onclick=loadProblems
filter.onchange=render
search.oninput=render
randomBtn.onclick=randomProblem