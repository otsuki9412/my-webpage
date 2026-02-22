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
function copyTableToClipboard() {
  const table = document.getElementById("dynamic-table");
  let csv = "";

  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const cells = [];
    for (let j = 0; j < row.cells.length; j++) {
        // 結果①の直前に矢印を追加 
        if (j === colCount - 2) { cells.push("→"); }
      const input = row.cells[j].querySelector("input");
      const value = input ? input.value : "";
      cells.push(value);
    }
    csv += cells.join(",") + "\n";
  }

  // クリップボードにコピー！
  navigator.clipboard.writeText(csv).then(() => {
    alert("表の内容をコピーしました！📋");
  }).catch(err => {
    alert("コピーに失敗しました…💦");
    console.error(err);
  });
}


