function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  if (username === "test" && password === "test123") {
    document.getElementById("login-form").style.display = "none";

    // 「ようこそ！」と「ログインに成功しました🎉」のテキストだけを非表示にする
    const welcome = document.getElementById("welcome");
    welcome.style.display = "block";

    // テキスト部分を削除（pタグとh2タグを削除）
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
    input.value = "0";
  }

  // 結果列は読み取り専用
  if (j === colCount - 2 || j === colCount - 1) {
    input.readOnly = true;
    input.style.backgroundColor = "#f0f0f0";
    input.value = "0";
  }

  // 入力時に0を消す
  input.addEventListener("focus", function () {
    if (input.value === "0") {
      input.value = "";
    }
  });

  // フォーカスが外れたとき、空なら0に戻す
  input.addEventListener("blur", function () {
    if (input.value.trim() === "") {
      input.value = "0";
      updateCalculatedValues();
    }
  });

  input.addEventListener("input", updateCalculatedValues);
  return input;
}

