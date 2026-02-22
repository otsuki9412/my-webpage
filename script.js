function login(event) {
  event.preventDefault(); // ← これが重要！

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  if (username === "test" && password === "test123") {
    document.getElementById("login-form").style.display = "none";

    const welcome = document.getElementById("welcome");
    welcome.style.display = "block";

    const headings = welcome.querySelectorAll("h2, p");
    headings.forEach(el => el.remove());

    createTable(5, 4);
  } else {
    errorMessage.textContent = "ユーザー名またはパスワードが間違っています。";
  }

  return false;
}

function createInputCell(i, j) {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `セル ${i + 1}-${j + 1}`;

  // 初期値の設定（1列目以外）
  if (j !== 0 && j < colCount - 2) {
    input.value = "";
  }

  // 結果列は読み取り専用
  if (j === colCount - 2 || j === colCount - 1) {
    input.readOnly = true;
    input.style.backgroundColor = "#f0f0f0";
    input.value = "0";
  }else if (j !== 0) { 
    input.value = ""; // ← 初期値を空にする！ 
    }



  input.addEventListener("input", updateCalculatedValues);
  return input;
}

