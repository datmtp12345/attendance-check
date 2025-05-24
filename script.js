const defaultMembers = [{
    id: "HE204906",
    name: "Trần Tuấn Anh",
    team: 4,
    status: "Không có mặt"
  },
  {
    id: "HS200273",
    name: "Nguyễn Đức Anh",
    team: 4,
    status: "Không có mặt"
  },
  {
    id: "HE201437",
    name: "Lê Quốc Đạt",
    team: 1,
    status: "Không có mặt"
  },
  {
    id: "HE205151",
    name: "Trần Khắc Đạt",
    team: 3,
    status: "Không có mặt"
  },
  {
    id: "HS204475",
    name: "Lê Đắc Tuấn Anh",
    team: 2,
    status: "Không có mặt"
  },
  {
    id: "HE204315",
    name: "Cao Văn Đạt",
    team: 3,
    status: "Không có mặt"
  },
  {
    id: "HE201118",
    name: "Lê Quang Đức",
    team: 1,
    status: "Không có mặt"
  },
  {
    id: "HE201209",
    name: "Phạm Đan Dương",
    team: 4,
    status: "Không có mặt"
  },
  {
    id: "HS204176",
    name: "Trần Thị Kim Hiền",
    team: 3,
    status: "Không có mặt"
  },
  {
    id: "HE204902",
    name: "Bùi Trung Hiếu",
    team: 4,
    status: "Không có mặt"
  },
  {
    id: "HE204638",
    name: "Hà Huy Hoàng",
    team: 2,
    status: "Không có mặt"
  },
  {
    id: "HS200507",
    name: "Trần Thị Thu Hồng",
    team: 4,
    status: "Không có mặt"
  },
  {
    id: "HE204019",
    name: "Nguyễn Phú Hoàng",
    team: 2,
    status: "Không có mặt"
  },
  {
    id: "HS204445",
    name: "Phạm Thị Hương",
    team: 2,
    status: "Không có mặt"
  },
  {
    id: "HS204216",
    name: "Đỗ Minh Khiêm",
    team: 1,
    status: "Không có mặt"
  },
  {
    id: "HS200347",
    name: "Đỗ Thị Thuỳ Linh",
    team: 2,
    status: "Không có mặt"
  },
  {
    id: "HE201320",
    name: "Nguyễn Phước Lộc",
    team: 4,
    status: "Không có mặt"
  },
  {
    id: "HA204002",
    name: "Phan Vũ Đức Lương",
    team: 4,
    status: "Không có mặt"
  },
  {
    id: "HS200817",
    name: "Nguyễn Thị Xuân Mai",
    team: 1,
    status: "Không có mặt"
  },
  {
    id: "HE201302",
    name: "Đào Bùi Bảo Ngọc",
    team: 2,
    status: "Không có mặt"
  },
  {
    id: "HE201048",
    name: "Bùi Xuân Quang",
    team: 1,
    status: "Không có mặt"
  },
  {
    id: "HE201896",
    name: "Nguyễn Hoàng Tú Nhi",
    team: 3,
    status: "Không có mặt"
  },
  {
    id: "HE201295",
    name: "Nguyễn Đức Quang",
    team: 2,
    status: "Không có mặt"
  },
  {
    id: "HS204031",
    name: "Bùi Thảo Quyên",
    team: 3,
    status: "Không có mặt"
  },
  {
    id: "HS204246",
    name: "Phan Hồng Quyên",
    team: 3,
    status: "Không có mặt"
  },
  {
    id: "HS200200",
    name: "Đặng Kỳ Thư",
    team: 1,
    status: "Không có mặt"
  },
  {
    id: "HE204651",
    name: "Lê Công Tuyển",
    team: 3,
    status: "Không có mặt"
  },
  {
    id: "HS200854",
    name: "Nguyễn Ngọc Ly Vân",
    team: 3,
    status: "Không có mặt"
  },
  {
    id: "HE200074",
    name: "Nguyễn Đức Minh",
    team: 1,
    status: "Không có mặt"
  }
];

// declare the variable in outer scope
let members;

function loadMembers() {
  return db
    .ref("members")
    .once("value")
    .then((snap) => {
      const stored = snap.exists() ? snap.val() : null;
      return stored || defaultMembers;
    });
}

loadMembers().then((members) => {
  console.log("Members ready:", members);
  // if you want, write default back to DB/localStorage:
  if (!Array.isArray(members) || members === defaultMembers) {
    db.ref("members").set(defaultMembers);
  }
});

let isAdmin = false;
let attendanceHistory = JSON.parse(localStorage.getItem("attendanceHistory")) || [];

function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

function renderMembers() {
  const memberList = document.getElementById("member-list");
  const stats = document.getElementById("member-stats");
  memberList.innerHTML = "";

  const sortedMembers = members.slice().sort((a, b) => a.team - b.team);

  let presentCount = 0;

  sortedMembers.forEach(member => {
    if (member.status === "Có mặt") presentCount++;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${member.id}</td>
      <td>${member.name}</td>
      <td>${member.team}</td>
      <td>
        <button id="btn-${member.id}"
                class="button ${member.status === "Có mặt" ? "present" : "absent"}"
                onclick="markAttendance('${member.id}')">
          ${member.status}
        </button>
      </td>
      <td>
        ${isAdmin
          ? `<button class="button remove"
                     onclick="removeMember('${member.id}')">Xóa</button>`
          : ""}
      </td>
    `;
    memberList.appendChild(row);
  });

  stats.textContent =
    `Tổng thành viên: ${members.length} | Đã điểm danh: ${presentCount}`;
}


window.adminLogin = function () {
  const email = document.getElementById("admin-email").value;
  if (email === "datmtp12345@gmail.com") {
    isAdmin = true;
    document.querySelector(".admin-login").style.display = "none";
    document.getElementById("admin-controls").style.display = "block";
    renderMembers();
  } else {
    alert("Bạn không có quyền truy cập!");
  }
};

window.markAttendance = function (id) {
  const member = members.find(m => m.id === id);
  if (attendanceHistory.some(entry => entry.id === id && entry.date === getCurrentDate())) {
    alert("Bạn đã điểm danh rồi!");
    return;
  }

  member.status = "Có mặt";
  db.ref("members").set(members);
  attendanceHistory.push({
    id: member.id,
    name: member.name,
    date: getCurrentDate()
  });

  localStorage.setItem("attendanceHistory", JSON.stringify(attendanceHistory));
  renderMembers();
};

window.toggleHistory = function () {
  const historyContainer = document.getElementById("history-container");
  historyContainer.style.display = historyContainer.style.display === "none" ? "block" : "none";
  renderHistory();
};

window.renderHistory = function () {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";

  const grouped = {};
  attendanceHistory.forEach(entry => {
    if (!grouped[entry.date]) grouped[entry.date] = [];
    grouped[entry.date].push(entry);
  });

  Object.keys(grouped).forEach(date => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${date}</td>
      <td>${grouped[date].length}</td>
      <td><button onclick="exportHistory('${date}')">Tải về</button></td>
    `;
    historyList.appendChild(row);
  });
};

window.exportHistory = function (date) {
  const filtered = attendanceHistory.filter(e => e.date === date);
  let content = `Lịch sử điểm danh - Ngày: ${date}\n`;
  filtered.forEach(e => {
    content += `${e.id}, ${e.name}\n`;
  });

  const blob = new Blob([content], {
    type: "text/plain"
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `diem_danh_${date}.txt`;
  a.click();
};

window.addMember = function () {
  const id = document.getElementById("new-id").value.trim();
  const name = document.getElementById("new-name").value.trim();
  const team = parseInt(document.getElementById("new-team").value);

  if (!id || !name || isNaN(team)) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (members.some(m => m.id === id)) {
    alert("Mã số đã tồn tại!");
    return;
  }

  members.push({
    id,
    name,
    team,
    status: "Không có mặt"
  });
  renderMembers();

  db.ref("members").set(members);

  document.getElementById("new-id").value = "";
  document.getElementById("new-name").value = "";
  document.getElementById("new-team").value = "";
};

window.removeMember = function (id) {
  if (!isAdmin) return;
  const index = members.findIndex(m => m.id === id);
  if (index !== -1) {
    members.splice(index, 1);
    db.ref("members").set(members);
    renderMembers();
  }
};

window.resetAttendance = function () {
  if (!isAdmin) return;

  members.forEach(m => m.status = "Không có mặt");
  attendanceHistory = [];
  localStorage.removeItem("attendanceHistory");
  db.ref("members").set(members);
  renderMembers();
};



/// aura

const musicList = [
  "musics/bà sáu bán xôi.mp3",
  "musics/mà tà cu.mp3",
  "musics/ui ia.mp3"
];

function getRandomMusic() {
  const index = Math.floor(Math.random() * musicList.length);
  return musicList[index];
}

function checkPassword() {
  const input = document.getElementById("passwordInput").value;
  if (input === "anhdatdepzai") {
    document.getElementById("authSection").style.display = "none";
    const button = document.getElementById("musicButton");
    button.style.display = "inline-block";
    button.classList.add("show");

    const music = document.getElementById("musicPlayer");
    music.src = getRandomMusic();
  } else {
    alert("Sai mã! Thử lại.");
  }
}

let flashIntervalId = null;
const body = document.body;
const images = [
  "pictures/do1.jpg",
  "pictures/do2.jpg",
  "pictures/do3.jpg",
  "pictures/do4.jpg",
  "pictures/do5.jpg",
  "pictures/do6.jpg",
  "pictures/do7.jpg"
];
let imgIndex = 0;

function flashBackground() {
  // Bật hiệu ứng rung + nháy sáng
  body.style.animation = "shake 0.25s infinite, flashBrightness 0.5s infinite";

  flashIntervalId = setInterval(() => {
    body.style.backgroundImage = `url(${images[imgIndex]})`;
    imgIndex = (imgIndex + 1) % images.length;
  }, 500);
}

function stopFlashBackground() {
  if (flashIntervalId) {
    clearInterval(flashIntervalId);
    flashIntervalId = null;
  }
  body.style.animation = ""; // Tắt hiệu ứng
}

function resetBackground() {
  body.style.backgroundImage = "url('pictures/Doraemon2.jpg')";
}

function toggleMusic() {
  const music = document.getElementById("musicPlayer");
  if (music.paused) {
    music.play();
    flashBackground();
  } else {
    music.pause();
    music.currentTime = 0;
    stopFlashBackground();
    resetBackground();
  }
}
// kết auraaura


//text h2 chay
const texts = [
  "Top 1 Luk Doraemon 😎",
  "Winning an debate is easy 🥲",
  "Đừng Thoát Luk 😏 ",
  "Đạt Đẹp Trai Là Thật 😘",
  "Bạn sợ MB 😥",
  "Cười nhiều vào 🤣"
];

function changeText() {
  const h2 = document.getElementById('randomText');
  let newText;
  do {
    newText = texts[Math.floor(Math.random() * texts.length)];
  } while (newText === h2.textContent); // tránh trùng văn bản
  h2.style.opacity = 0;
  setTimeout(() => {
    h2.textContent = newText;
    h2.style.opacity = 1;
  }, 300);
}

// Tự động đổi mỗi 5 giây
setInterval(changeText, 5000);



// mớimới
if (!localStorage.getItem("loggedIn")) {
  window.location.href = "index.html";
}
// Ghi lên Firebase
// Lắng nghe thay đổi
db.ref("members").on("value", snapshot => {
  const data = snapshot.val();
  if (data) {
    members = data;
    renderMembers(); // Gọi lại hàm hiển thị
  }
});

renderMembers();