let resident = document.getElementById('resident');
let enemy = document.getElementById('enemy'); // Ensure enemy exists in your HTML
let isJumping = false;
let gameStarted = false;

// Quest system
const quests = {
    findThomas: {
        name: "Help Mia Find Her Missing Friend Thomas",
        description: "Find Thomas somewhere in the area.",
        completed: false,
        started: false,
        onComplete: function () {
            alert("You did it! You found Thomas!");
            this.completed = true;
            updateQuestLog();
        }
    }
};

// Character Movement
document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowRight') {
        resident.style.left = (resident.offsetLeft + 20) + 'px';
    } else if (event.code === 'ArrowLeft') {
        resident.style.left = (resident.offsetLeft - 20) + 'px';
    } else if (event.code === 'Space' && !isJumping) {
        jump();
    } else if (event.code === 'Enter') {
        throwProjectile(true);
    }
});

function jump() {
    isJumping = true;
    resident.style.bottom = '150px';

    setTimeout(() => {
        resident.style.bottom = '0px';
        isJumping = false;
    }, 300);
}

// Start a quest
function startQuest(questName) {
    if (quests[questName] && !quests[questName].started) {
        quests[questName].started = true;
        alert(`Quest Started: ${quests[questName].name}`);
        updateQuestLog();
    }
}

// Complete a quest
function completeQuest(questName) {
    if (quests[questName] && quests[questName].started && !quests[questName].completed) {
        quests[questName].onComplete();
    }
}

// Update quest log in UI
function updateQuestLog() {
    const questList = document.getElementById("quest-list");
    if (!questList) return; // Ensure element exists

    questList.innerHTML = "";
    for (let key in quests) {
        const quest = quests[key];
        let listItem = document.createElement("li");
        listItem.textContent = `${quest.name} - ${quest.completed ? "✔ Completed" : "❌ In Progress"}`;
        questList.appendChild(listItem);
    }
}

// Player throws projectile to the left
function throwProjectile(isPlayer) {
    if (!enemy) return; // Ensure enemy exists

    const projectile = document.createElement('img');
    projectile.src = 'dog.png'; // Replace with your projectile image
    projectile.classList.add('projectile');

    if (isPlayer) {
        projectile.style.left = (resident.offsetLeft + 60) + 'px';
        projectile.style.bottom = '50px';
        projectile.style.animation = 'throwLeftAnimation 1s linear forwards';
    }

    document.body.appendChild(projectile);

    const projectileInterval = setInterval(() => {
        if (isCollision(projectile, enemy)) {
            enemy.classList.add('hit');
            setTimeout(() => {
                enemy.remove();
                completeQuest('findThomas'); // Completing quest when enemy is defeated
            }, 200);
            clearInterval(projectileInterval);
            projectile.remove();
        }
    }, 50);

    setTimeout(() => {
        projectile.remove();
        clearInterval(projectileInterval);
    }, 1000);
}

// Check for collisions
function isCollision(element1, element2) {
    let rect1 = element1.getBoundingClientRect();
    let rect2 = element2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

// Move Enemy (Example)
function moveEnemy() {
    if (!enemy) return;

    let position = 500; // Example starting position
    let direction = -5;

    setInterval(() => {
        position += direction;
        enemy.style.left = position + 'px';

        if (position <= 100 || position >= 500) {
            direction *= -1; // Reverse direction
        }
    }, 100);
}

moveEnemy();
updateQuestLog();
