const heading = document.getElementById("heading");
const text = document.getElementById("text");
const clearBtn = document.getElementById("clear");
const saveBtn = document.getElementById("save");
const savedTextArea = document.querySelector("#saved-text-area ul");
const nothing = document.getElementById("nothing");
const getAllDeleteBtn = document.getElementsByClassName("ListDelete");
const getAllEditBtn = document.getElementsByClassName("ListEdit");
const deleteAll = document.getElementById("deleteAll")
let notes = {};

const checkLi = () => {
    const li = document.querySelector("#saved-text-area ul li");
    if (li) {
        nothing.setAttribute("class", "disable");
    }
    else {
        nothing.removeAttribute("class", "disable");
    }
}

const performDeletion = () => {
    for (let btn of getAllDeleteBtn) {
        btn.addEventListener("click", () => {
            btn.parentElement.parentElement.remove();
            const getKey = btn.parentElement.parentElement.firstElementChild.textContent;
            delete notes[getKey];
            localStorage.setItem("storeNote", JSON.stringify(notes))
            checkLi();
        })
    }
}

const performEdition = () => {
    for (let btn of getAllEditBtn) {
        btn.addEventListener("click", (event) => {
            btn.setAttribute("class", "disable");
            btn.previousElementSibling.setAttribute("class", "disable")
            const newBtn = document.createElement("button")
            const newClearBtn = document.createElement("button")
            newClearBtn.textContent = "Clear"
            newBtn.textContent = "Save"
            const input = document.createElement("input")
            input.setAttribute("placeholder", "Enter heading")
            const textarea = document.createElement("textarea")
            textarea.setAttribute("placeholder", "Enter text here")
            const getParentElement = btn.parentElement.parentElement;
            const getHeadingElement = getParentElement.firstChild;
            const getParaElement = getParentElement.querySelector("p")
            const headingVal = getHeadingElement.textContent;
            const paraVal = getParaElement.textContent;
            const div = getParentElement.lastChild;
            newClearBtn.addEventListener("click", () => {
                input.value = ""
                textarea.value = ""
                input.focus();
            })
            div.append(newBtn);
            div.prepend(newClearBtn)
            getParentElement.replaceChild(input, getHeadingElement)
            getParentElement.replaceChild(textarea, getParaElement)
            input.focus();
            input.value = headingVal;
            textarea.value = paraVal;
            input.addEventListener("keydown", (event) => {
                if (event.key == "Enter" && input.value) {
                    event.preventDefault()
                    textarea.focus()
                }
            })

            textarea.addEventListener("keydown", (event) => {
                if (event.key == "Enter" && event.shiftKey) {

                } else if (event.key == "Enter") {
                    event.preventDefault();
                    newBtn.click();
                }
            })

            newBtn.addEventListener("click", () => {
                if (input.value.trim() && textarea.value.trim()) {
                    newBtn.remove();
                    newClearBtn.remove();
                    btn.previousElementSibling.removeAttribute("class", "disable")
                    btn.removeAttribute("class", "disable")
                    const inputVal = input.value;
                    const textareaVal = textarea.value;
                    if (inputVal && textareaVal) {
                        const h = document.createElement("h2")
                        h.textContent = inputVal;
                        const p = document.createElement("p")
                        p.textContent = textareaVal;
                        getParentElement.replaceChild(h, input);
                        getParentElement.replaceChild(p, textarea);
                        delete notes[headingVal];
                        notes[inputVal] = textareaVal
                        localStorage.setItem("storeNote", JSON.stringify(notes))
                    }
                }
            })
        })
    }
}

const performDeletionAll = () => {
    const Children = savedTextArea.querySelectorAll("li");
    for(child of Children){
        child.remove();
        localStorage.removeItem("storeNote")
    }
    checkLi();
}
if (localStorage.getItem("storeNote")) {
    notes = JSON.parse(localStorage.getItem("storeNote"));
}

heading.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && heading.value) {
        event.preventDefault();
        text.focus();
    }
})

text.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && event.shiftKey) {

    } else if (event.key == "Enter") {
        event.preventDefault();
        if (text.value) {
            saveBtn.click();
            clearBtn.click();
            heading.focus();
        }
    }
})

const saveNote = (event) => {
    event.preventDefault()
    const li = document.createElement("li");
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    const ListDelete = document.createElement("button");
    ListDelete.setAttribute("class", "ListDelete")
    ListDelete.textContent = "Delete"
    const ListEdit = document.createElement("button");
    ListEdit.textContent = "Edit"
    ListEdit.setAttribute("class", "ListEdit")
    const div = document.createElement("div");
    div.setAttribute("class", "buttons")
    const headingVal = heading.value;
    const textVal = text.value;
    h2.textContent = headingVal;
    p.textContent = textVal;
    if (headingVal.trim() && textVal.trim()) {
        li.append(h2);
        li.append(p);
        div.append(ListDelete)
        div.append(ListEdit)
        li.append(div)
        savedTextArea.append(li)
        notes[headingVal] = textVal;
        localStorage.setItem("storeNote", JSON.stringify(notes))
    }
    checkLi();
    performDeletion()
    performEdition()
}

const getNote = () => {
    const retrieveData = JSON.parse(localStorage.getItem("storeNote"));
    for (let data in retrieveData) {
        const li = document.createElement("li");
        const h2 = document.createElement("h2");
        const p = document.createElement("p");
        const ListDelete = document.createElement("button");
        ListDelete.setAttribute("class", "ListDelete");
        ListDelete.textContent = "Delete";
        const ListEdit = document.createElement("button");
        ListEdit.textContent = "Edit";
        ListEdit.setAttribute("class", "ListEdit");
        const div = document.createElement("div");
        div.setAttribute("class", "buttons");

        h2.textContent = data;
        p.textContent = retrieveData[data];
        li.append(h2);
        li.append(p);
        div.append(ListDelete);
        div.append(ListEdit);
        li.append(div);
        savedTextArea.append(li);
    }
    checkLi();
    performDeletion();
    performEdition();
}

window.onload = () => {
    getNote();
}

deleteAll.addEventListener("click", performDeletionAll)

saveBtn.addEventListener("click", saveNote);