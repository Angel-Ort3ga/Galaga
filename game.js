let gameState = "menu";
let player; 
let bullets = []; 
let enemies = []; 
let enemyBullets = []; 
let powerUps = []; 
let explosions = []; 
let score = 0; 
let level = 1; 
let lives = 3; 
let gameOver = false; 
let paused = false; 
// ======================= // 
// IMAGENES // 
// ======================= 
let bgImg; 
let playerImg; 
let enemyImgs = {}; 
let playerBulletImg; 
let enemyBulletImg; 
let enemyFastBulletImg; 
let enemyBigBulletImg; 
let enemyEliteBulletImg; 
let enemyBossBulletImg;
let lifeImg; 
let doubleShotImg; 
let tripleShotImg; 
let shieldImg; 
let freezeImg; 
let magnetImg; 
let slowTimeImg; 
let explosionImgs = []; 
// ======================= //
//  POWERUPS // 
// ======================= 
let shieldActive = false; 
let tripleShotActive = false; 
let freezeActive = false; 
let magnetActive = false; 
let slowTimeActive = false; 
let tripleShotTimer = 0;
let freezeTimer = 0; 
let slowTimer = 0; 
let magnetTimer = 0;
// ======================= // 
// SOUNDS // 
// ======================= 
let music;
let shootSound;
let explosionSound;
let powerupSound;
let pauseSound;
let levelupSound;
let hitSound;
let gameoverSound;
let victoryMusic;

let gameoverSoundPlayed = false;
// ======================= // 
// PRELOAD // 
// ======================= 
function preload() { 
  bgImg = loadImage("assets/images/background.png"); 
  playerImg = loadImage("assets/images/player.png"); 
  
  enemyImgs.basic = loadImage("assets/images/basic.png"); 
  enemyImgs.fast = loadImage("assets/images/fast.png"); 
  enemyImgs.tank = loadImage("assets/images/tank.png"); 
  enemyImgs.elite = loadImage("assets/images/elite.png"); 
  enemyImgs.boss = loadImage("assets/images/boss.png");

  playerBulletImg = loadImage("assets/images/playerBullet.png"); 
  enemyBulletImg = loadImage("assets/images/enemyBullet.png"); 
  enemyFastBulletImg = loadImage("assets/images/enemyFastBullet.png"); 
  enemyBigBulletImg = loadImage("assets/images/enemyBigBullet.png"); 
  enemyEliteBulletImg = loadImage("assets/images/enemyEliteBullet.png"); 
  enemyBossBulletImg = loadImage("assets/images/bossBullet.png");

  lifeImg = loadImage("assets/images/life.png"); 
  doubleShotImg = loadImage("assets/images/doubleShot.png"); 
  tripleShotImg = loadImage("assets/images/tripleShot.png"); 
  shieldImg = loadImage("assets/images/shield.png"); 
  freezeImg = loadImage("assets/images/freeze.png"); 
  magnetImg = loadImage("assets/images/magnet.png"); 
  slowTimeImg = loadImage("assets/images/slowTime.png"); 

  explosionImgs[0] = loadImage("assets/images/explosion1.png"); 
  explosionImgs[1] = loadImage("assets/images/explosion2.png"); 
  explosionImgs[2] = loadImage("assets/images/explosion3.png"); 
  explosionImgs[3] = loadImage("assets/images/explosion4.png");
  
  music = loadSound("assets/audio/music.mp3");
  menuMusic = loadSound("assets/audio/menu.mp3");
  shootSound = loadSound("assets/audio/shoot.mp3");
  explosionSound = loadSound("assets/audio/explosion.mp3");
  powerupSound = loadSound("assets/audio/powerup.mp3");
  pauseSound = loadSound("assets/audio/pause.mp3");
  levelupSound = loadSound("assets/audio/levelup.mp3");
  hitSound = loadSound("assets/audio/hit.mp3");
  gameoverSound = loadSound("assets/audio/gameover.mp3");
  victoryMusic = loadSound("assets/audio/victory.mp3");

   // Ajuste volúmenes
  music.setVolume(0.4);
  shootSound.setVolume(0.6);
  explosionSound.setVolume(0.8);
  powerupSound.setVolume(0.7);
  pauseSound.setVolume(0.5);
  levelupSound.setVolume(0.7);
  hitSound.setVolume(0.8);
  gameoverSound.setVolume(1.0);
  
}

function setup() {
  createCanvas(1200, 800);

  player = {
    x: width / 2,
    y: height - 70,
     w: 70,
     h: 70,
    speed: 8,
    doubleShot: false
  };

  music.setVolume(0.4);

 // spawnEnemies(level);  
}

function draw() {

  if (gameState === "menu") {
    showMenu();
    return;
  }

  if (gameState === "controls") {
    showControls();
    return;
  }

  if (bgImg) { 
    image(bgImg, 0, 0, width, height); 
  } else { 
    background(0); 
  }

  // GAME OVER
  if (gameOver) {
    showGameOver();
    return;
  }

  if (gameState === "victory") {
    showVictory();
    return; 
  }

  // PAUSA
  if (paused) {
    if (music.isPlaying()) {
      music.pause(); // pausa la música
    }
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("PAUSA", width / 2, height / 2);
    return;
  } else {
    // si se reanuda el juego, vuelve a sonar
    if (gameState === "playing" && !music.isPlaying()) {
      music.loop();
    }
  }


  if (freezeActive && millis() > freezeTimer) {
  freezeActive = false;
  }
  if (slowTimeActive && millis() > slowTimer) {
    slowTimeActive = false;
  }
  if (tripleShotActive && millis() > tripleShotTimer) {
    tripleShotActive = false;
  }
  if (magnetActive && millis() > magnetTimer) {
    magnetActive = false;
  }
  // MOVIMIENTO JUGADOR
  if (keyIsDown(LEFT_ARROW)) {
    player.x -= player.speed;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.x += player.speed;
  }

  // LIMITES
  player.x = constrain(player.x, 0, width - player.w);

  // =========================
  // JUGADOR
  // =========================

  if (playerImg) { 
    image( 
      playerImg, 
      player.x, 
      player.y, 
      player.w, 
      player.h 
    ); 
  } else {

    fill(0,255,0);
    
    rect( 
      player.x, 
      player.y, 
      player.w, 
      player.h, 
      5 
    ); 
  } 
  // ESCUDO 
  if (shieldActive) {
     noFill(); 
     stroke(0,255,255); 
     strokeWeight(3); 

     ellipse( 
      player.x + player.w/2, 
      player.y + player.h/2, 
      70 
      
    ); 
    noStroke(); 
  }

  // =========================
  // BALAS DEL JUGADOR
  // =========================

  fill(255, 255, 0);

  for (let i = bullets.length - 1; i >= 0; i--) {

    let b = bullets[i];

    if (playerBulletImg) { 
      image( 
        playerBulletImg, 
        b.x - 8, 
        b.y, 18, 
        30 
      ); 
    } else { 
      fill(255,255,0); 

      rect( 
        b.x, 
        b.y, 
        5, 
        12 
      ); 
    }

    b.y -= 8;

    if (b.y < 0) {
      bullets.splice(i, 1);
    }
  }

  // =========================
  // ENEMIGOS
  // =========================

  for (let i = enemies.length - 1; i >= 0; i--) {

    let e = enemies[i];

    // COLORES
    if (e.type === "basic") {
      fill(255, 0, 0);
    }

    else if (e.type === "fast") {
      fill(255, 165, 0);
    }

    else if (e.type === "tank") {

      let hpRatio = e.hp / e.maxHp;

      if (hpRatio > 0.6) {
        fill(0, 0, 255);
      }

      else if (hpRatio > 0.3) {
        fill(255, 165, 0);
      }

      else {
        fill(255, 0, 0);
      }
    }

    else if (e.type === "elite") {
      fill(255, 0, 255);
    }

    else if (e.type === "boss") {
      fill(128, 0, 128);
      if (enemyImgs.boss) {
        image(enemyImgs.boss, e.x, e.y, e.w, e.h);
      } else {
        rect(e.x, e.y, e.w, e.h, 10);
      }

      // movimiento zig-zag lento
      e.x += sin(frameCount * 0.05) * 12;
      e.y += 0.12;
      e.x = constrain(e.x, 0, width - e.w);
      // disparo múltiple
      if (!e.lastShot || millis() - e.lastShot > 1500) {
        if (random(1) < 0.02) {
          for (let k = -1; k <= 1; k++) {
            enemyBullets.push({
              x: e.x + e.w / 2,
              y: e.y + e.h,
              w: 10,
              h: 20,
              speed: 4,
              type: "boss",
              vx: k * 1.5
            });
          }
          e.lastShot = millis();
        }
      }

      // enemigos según porcentaje de vida
      let hpRatio = e.hp / e.maxHp;
      if (hpRatio <= 0.75 && !e.spawn50) {
        spawnEnemiesExtra("fast", 3); 
        e.spawn50 = true;
      }
      if (hpRatio <= 0.50 && !e.spawn25) {
        spawnEnemiesExtra("tank", 2); 
        spawnEnemiesExtra("fast", 3); 
        e.spawn25 = true;
      }
      if (hpRatio <= 0.25 && !e.spawn10) {
        spawnEnemiesExtra("elite", 3); 
        spawnEnemiesExtra("tank", 2); 
        spawnEnemiesExtra("fast", 3); 
        e.spawn10 = true;
      }
    }

    // DIBUJO
    if (enemyImgs[e.type]) {
      image(enemyImgs[e.type], e.x, e.y, e.w, e.h);
    } else {
      rect(e.x, e.y, e.w, e.h, 5);
    }

    // =========================
    // MOVIMIENTO
    // =========================

    if (e.type === "basic") {

      let moveSpeed = e.speed;

      if (freezeActive) moveSpeed *= 0.1;

      if (slowTimeActive) moveSpeed *= 0.5;

      e.x += moveSpeed;

      if (e.x > width - e.w || e.x < 0) {
        e.speed *= -1;
        e.y += 20;
      }
    }

    else if (e.type === "fast") {

      let moveSpeed = e.speed * 1.5;

      if (freezeActive) moveSpeed *= 0.1;

      if (slowTimeActive) moveSpeed *= 0.5;

      e.x += moveSpeed;

      // bajar poco a poco
      e.y += 0.4;

      // cambio aleatorio de dirección
      if (random(1) < 0.01) {
        e.speed *= -1;
      }

      if (e.x > width - e.w || e.x < 0) {
        e.speed *= -1;
      }
    }

    else if (e.type === "tank") {

      let moveFactor = 1;

      if (freezeActive) moveFactor *= 0.1;
      if (slowTimeActive) moveFactor *= 0.5;

      // bajar lentamente
      e.y += 0.25 * moveFactor;

      // movimiento errático
     e.x += sin(frameCount * 0.05 + e.y * 0.01) * 4 * moveFactor;

      // mantenerse dentro de pantalla
      e.x = constrain(
        e.x,
        0,
        width - e.w
      );
    }

    else if (e.type === "elite") {

      let moveFactor = 1;

      if (freezeActive) moveFactor *= 0.1;
      if (slowTimeActive) moveFactor *= 0.5;

      // zig-zag horizontal
      e.x += sin(frameCount * 0.01 + e.y * 0.2) * 35 * moveFactor;

      // movimiento vertical variable
      e.y += random(0.1, 0.3) * moveFactor;

      // pequeños saltos laterales
      /*if (random(1) < 0.01) {
        e.x += random(-5, 5);
      }*/

      e.x = constrain(
        e.x,
        0,
        width - e.w
      );
    }

    // =========================
    // DISPAROS ENEMIGOS
    // =========================

    let fireRate = 0.002 + level * 0.001;

    // BASIC
    if (e.type === "basic" && random(1) < fireRate) {

      enemyBullets.push({
        x: e.x + e.w / 2,
        y: e.y + e.h,
        w: 5,
        h: 10,
        speed: 5 + level * 0.2,
        type: "normal"
      });
    }

    // FAST
    if (e.type === "fast" && random(1) < fireRate * 1.5) {

      enemyBullets.push({
        x: e.x + e.w / 2,
        y: e.y + e.h,
        w: 5,
        h: 10,
        speed: 8,
        type: "fast"
      });
    }

    // TANK
    if (e.type === "tank" && random(1) < fireRate * 1.5) {

      enemyBullets.push({
        x: e.x + e.w / 2,
        y: e.y + e.h,
        w: 10,
        h: 20,
        speed: 4,
        type: "big"
      });
    }

    // ELITE
    if (e.type === "elite") {
      if (!e.lastShot || millis() - e.lastShot > 2500) { // cada 2.5 segundos
        if (random(1) < fireRate * 0.5) { // menos probabilidad
          for (let k = -1; k <= 1; k++) {
            enemyBullets.push({
              x: e.x + e.w / 2,
              y: e.y + e.h,
              w: 6,
              h: 12,
              speed: 5,
              type: "elite",
              vx: k * 1.5
            });
          }
          e.lastShot = millis();
        }
      }
    }

    // =========================
    // COLISIONES
    // =========================

    // ENEMIGO VS PLAYER
   if (collides(e, player)) {

      explosions.push({
        x: e.x,
        y: e.y,
        frame: 0
      });

      enemies.splice(i, 1);

      if (shieldActive) {

        shieldActive = false;

      } else {

        lives--;
        hitSound.play();

        if (lives <= 0) {
          gameOver = true;
        
          gameoverSound.play();
        }
      }

      continue;
    }

    // BALAS VS ENEMIGOS
    for (let j = bullets.length - 1; j >= 0; j--) {

      let b = bullets[j];

      if (collides(b, e, 5, 12)) {

        e.hp--;

        bullets.splice(j, 1);

       if (e.hp <= 0) {
          //explosionSound.play();

          explosions.push({
            x: e.x + e.w / 2,
            y: e.y + e.h / 2,
            frame: 0,
            size: 90
          });

          enemies.splice(i, 1);

          if (e.type === "boss") {
            e.bossDefeated = true;
          } else {
            score += getEnemyPoints(e.type);

            // POWERUPS solo para enemigos normales
            if (random(1) < 0.12) {
              powerUps.push({
                x: e.x,
                y: e.y,
                type: random([
                  "life", "double", "triple", "shield", "freeze", "magnet", "slowTime"
                ])
              });
            }
          }
        }

        break;
      }
    }
  }

  // =========================
  // BALAS ENEMIGAS
  // =========================

  for (let i = enemyBullets.length - 1; i >= 0; i--) {

    let eb = enemyBullets[i];

    if (eb.type === "normal") fill(0, 0, 255);
    else if (eb.type === "fast") fill(255);
    else if (eb.type === "big") fill(255, 0, 255);
    else if (eb.type === "elite") fill(255, 255, 0);

    if (eb.type === "normal" && enemyBulletImg) { 
      image(enemyBulletImg, eb.x, eb.y, 18, 18); 
    } else if (eb.type === "fast" && enemyFastBulletImg) { 
      image(enemyFastBulletImg, eb.x, eb.y, 18, 18); 
    } else if (eb.type === "big" && enemyBigBulletImg) { 
      image(enemyBigBulletImg, eb.x, eb.y, 30, 30); 
    } else if (eb.type === "elite" && enemyEliteBulletImg) {
       image(enemyEliteBulletImg, eb.x, eb.y, 22, 22); 
    }  else if (eb.type === "boss" && enemyBossBulletImg) {
     image(enemyBossBulletImg, eb.x, eb.y, 28, 28);
     }else { if (eb.type === "normal") fill(0,0,255); 
        else if (eb.type === "fast") fill(255); 
        else if (eb.type === "big") fill(255,0,255); 
        else if (eb.type === "elite") fill(255,255,0); 

        rect(eb.x, eb.y, eb.w, eb.h); 
      }

    let bulletSpeed = eb.speed;

    if (freezeActive) bulletSpeed *= 0.1;

    if (slowTimeActive) bulletSpeed *= 0.5;

    eb.y += bulletSpeed;
    if (eb.vx) {
      eb.x += eb.vx;
    }

    if (collides(eb, player, eb.w, eb.h)) {

      enemyBullets.splice(i, 1);

      if (shieldActive) {

        shieldActive = false;

      } else {

        explosions.push({
          x: player.x + player.w / 2,
          y: player.y + player.h / 2,
          frame: 0,
          size: 150
        });

        lives--;

        if (lives <= 0) {
          gameOver = true;
        }
      }
    }

    else if (eb.y > height) {
      enemyBullets.splice(i, 1);
    }
  }

  // =========================
  // POWERUPS
  // =========================

  for (let i = powerUps.length - 1; i >= 0; i--) {

    let p = powerUps[i];

  // =========================
  // MAGNET
  // =========================

  if (magnetActive) {

    let dx = player.x - p.x;
    let dy = player.y - p.y;

    let dista = sqrt(dx * dx + dy * dy);

    if (dista < 200) {

      p.x += dx * 0.03;
      p.y += dy * 0.03;
    }
  }

  // =========================
  // DIBUJAR POWERUP
  // =========================


    if (p.type === "life" && lifeImg) 
      image(lifeImg, p.x, p.y, 40, 40); 
    
    else if (p.type === "double" && doubleShotImg) 
      image(doubleShotImg, p.x, p.y, 40, 40); 
    
    else if (p.type === "triple" && tripleShotImg) 
      image(tripleShotImg, p.x, p.y, 40, 40); 
    
    else if (p.type === "shield" && shieldImg) 
      image(shieldImg, p.x, p.y, 40, 40); 
    
    else if (p.type === "freeze" && freezeImg) 
      image(freezeImg, p.x, p.y, 40, 40); 
    
    else if (p.type === "magnet" && magnetImg) 
      image(magnetImg, p.x, p.y, 40, 40); 
    
    else if (p.type === "slowTime" && slowTimeImg) 
      image(slowTimeImg, p.x, p.y, 40, 40); 
    
    else 
      ellipse(p.x, p.y, 20);

    p.y += 2;

    if (collides(p, player, 30, 30)) {

      powerupSound.play();

      if (p.type === "life") {
        lives++;
      }

      if (p.type === "double") {
        player.doubleShot = true;
      }

      if (p.type === "triple") {
        tripleShotActive = true;
        tripleShotTimer = millis() + 10000;
      }

      if (p.type === "shield") {
        shieldActive = true;
      }

      if (p.type === "freeze") {
        freezeActive = true;
        freezeTimer = millis() + 5000;
      }

      if (p.type === "magnet") {
        magnetActive = true;
        magnetTimer = millis() + 8000;
      }

      if (p.type === "slowTime") {
        slowTimeActive = true;
        slowTimer = millis() + 5000;
      }

      powerUps.splice(i, 1);
    }

    else if (p.y > height) {
      powerUps.splice(i, 1);
    }
  }

// =========================
// EXPLOSIONES
// =========================

  for (let i = explosions.length - 1; i >= 0; i--) {

    let ex = explosions[i];

    let frame = floor(ex.frame);

    let size = ex.size || 90;

    if (
      explosionImgs.length > 0 &&
      frame < explosionImgs.length
    ) {

      image(
        explosionImgs[frame],
        ex.x - size / 2,
        ex.y - size / 2,
        size,
        size
      );
    }

    ex.frame += 0.25;

    if (ex.frame >= 4) {
      explosions.splice(i, 1);
    }
  }
  // =========================
  // HUD
  // =========================

  fill(255);

  textSize(24);

  textAlign(LEFT);

  text("PUNTOS: " + score, 10, 30);
  text("NIVEL: " + level, 10, 60);
  for (let i = 0; i < lives; i++) {
  image(lifeImg, 10 + i * 30, 85, 25, 25);
}

  let hudY = 130;

  // HUD del jefe (barra de vida)
for (let i = 0; i < enemies.length; i++) {
  if (enemies[i].type === "boss") {
    let boss = enemies[i];
    // fondo rojo
    fill(255, 0, 0);
    rect(300, 20, 600, 20);
    // barra verde proporcional
    fill(0, 255, 0);
    let hpWidth = map(boss.hp, 0, boss.maxHp, 0, 600);
    rect(300, 20, hpWidth, 20);
    // borde blanco
    stroke(255);
    noFill();
    rect(300, 20, 600, 20);
    noStroke();
    // texto
    fill(255);
    textAlign(CENTER);
    textSize(16);
    text("JEFE FINAL", 600, 15);
  }
}

  textSize(16);

  if (shieldActive) {
    image(shieldImg, 10, hudY - 20, 20, 20);
    hudY += 25;
  }

  if (player.doubleShot) {
    image(doubleShotImg, 10, hudY - 20, 20, 20);
    hudY += 25;
  }

  if (tripleShotActive) {
    image(tripleShotImg, 10, hudY - 20, 20, 20);
    hudY += 25;
  }

  if (freezeActive) {
    image(freezeImg, 10, hudY - 20, 20, 20);
    hudY += 25;
  }

  if (magnetActive) {
    image(magnetImg, 10, hudY - 20, 20, 20);
    hudY += 25;
  }

  if (slowTimeActive) {
    image(slowTimeImg, 10, hudY - 20, 20, 20);
    hudY += 25;
  }
  // SIGUIENTE NIVEL
    if (gameState === "playing" && enemies.length === 0) {
      if (level === 20) {
        gameState = "victory";
        showVictory();
        return;
      } else {
        level++;
        levelupSound.play();
        spawnEnemies(level);
      }
    }
}

function showMenu() {

  if (!menuMusic.isPlaying() && userStartAudio()) {
    stopAllMusic();
    menuMusic.loop();
  }

  image(bgImg, 0, 0, width, height);

  fill(0,180);
  rect(0,0,width,height);

  fill(255);

  textAlign(CENTER);

  textSize(70);
  text("GALAXY DEFENDER", width/2, 150);

  textSize(40);

  text("1 - JUGAR", width/2, 320);

  text("2 - CONTROLES", width/2, 400);

}

function showControls() {

   if (!menuMusic.isPlaying()) {
    stopAllMusic();
    menuMusic.loop();
  }

  if (bgImg) {
    image(bgImg, 0, 0, width, height);
  } else {
    background(0);
  }

  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);

  textAlign(CENTER);

  textSize(50);

  text("CONTROLES", width/2,100);

  textSize(28);

  text("← →  MOVER NAVE", width/2,250);

  text("ESPACIO  DISPARAR", width/2,400);

  text("P  PAUSA", width/2,330);

  text("R  REINICIAR", width/2,480);

  text("ESC  VOLVER", width/2,600);

}

// =========================
// TECLAS
// =========================
function keyPressed() {

  if(gameState === "menu"){

    if (key === "1") {
      gameState = "playing";
      stopAllMusic();
      music.loop();
      //level = 20;modificar nivel
      spawnEnemies(level);
    }

    if(key === "2"){
      gameState = "controls";
    }

    return;
  }

  if(gameState === "controls"){

    if(keyCode === ESCAPE){
      gameState = "menu";
    }

    return;
  }

  // DISPARO
  if (key === " ") {

    shootSound.play();

  bullets.push({
    x: player.x + player.w / 2 - 2,
    y: player.y
  });

  if (player.doubleShot) {

    bullets.push({
      x: player.x + player.w / 2 - 15,
      y: player.y
    });

    bullets.push({
      x: player.x + player.w / 2 + 10,
      y: player.y
    });
  }

  if (tripleShotActive) {

    bullets.push({
      x: player.x + player.w / 2 - 25,
      y: player.y
    });

    bullets.push({
      x: player.x + player.w / 2 + 25,
      y: player.y
    });
  }
}

  // PAUSA
  if (key === "p" || key === "P") {
    paused = !paused;

    pauseSound.play();
  }
  
  // REINICIAR
  if ((gameOver || gameState === "victory") && (key === "r" || key === "R")) {
    restartGame();
  }
}

// =========================
// CREAR ENEMIGOS
// =========================

function spawnEnemies(level) {

  enemies = [];

    if (level === 20) {
    enemies.push({
      x: width / 2 - 100,
      y: 50,
      w: 120,
      h: 120,
      speed: 1,
      hp: 50,
      maxHp: 50,
      type: "boss"
    });
    return; // solo jefe final
  }

  let numEnemies = Math.min(6 + level * 2, 15);

  for (let i = 0; i < numEnemies; i++) {

    let possibleTypes = ["basic"];

    if (level >= 4) possibleTypes.push("fast");
    if (level >= 9) possibleTypes.push("tank");
    if (level >= 14) possibleTypes.push("elite");

    let type = random(possibleTypes);

    enemies.push({

      x: 50 + (i % 8) * 90,
      y: 50 + floor(i / 8) * 80,

      w:
        type === "basic" ? 70 :
        type === "fast" ? 60 :
        type === "tank" ? 100 :
        75,

      h:
        type === "basic" ? 70 :
        type === "fast" ? 60 :
        type === "tank" ? 100 :
        75,
      speed:
        type === "fast"
          ? 3 + level * 0.4
          : 2 + level * 0.3,

      hp:
        type === "tank"
          ? 3 + floor(level / 4)
          : type === "elite"
          ? 5
          : 1,

      maxHp:
        type === "tank"
          ? 3 + floor(level / 4)
          : type === "elite"
          ? 5
          : 1,

      type: type
    });
  }
}

// =========================
// PUNTOS
// =========================

function getEnemyPoints(type) {

  if (type === "basic") return 100;
  if (type === "fast") return 150;
  if (type === "tank") return 300;
  if (type === "elite") return 500;

  return 100;
}

// =========================
// COLISIONES
// =========================

function collides(a, b, aw = a.w, ah = a.h) {

  return (
    a.x < b.x + b.w &&
    a.x + aw > b.x &&
    a.y < b.y + b.h &&
    a.y + ah > b.y
  );
}

// =========================
// GAME OVER
// =========================

function showGameOver() {

   if (!gameoverSound.isPlaying()) {
    stopAllMusic();
    gameoverSound.play();
    gameoverSoundPlayed = true;
  }

  if (bgImg) {
    image(bgImg, 0, 0, width, height);
  } else {
    background(0);
  }

  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  fill(255, 0, 0);

  textAlign(CENTER, CENTER);
  textSize(50);

  text("GAME OVER", width / 2, height / 2 - 60);

  fill(255);

  textSize(28);

  text(
    "PUNTUACIÓN FINAL: " + score,
    width / 2,
    height / 2
  );

  textSize(20);

  fill(0, 255, 255);

  text(
    "Presiona R para reiniciar",
    width / 2,
    height / 2 + 60
  );
}

function showVictory() {
  stopAllMusic();
  if (!victoryMusic.isPlaying()) {
    victoryMusic.play();
  }

  if (bgImg) {
    image(bgImg, 0, 0, width, height);
  } else {
    background(0);
  }

  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  fill(0, 255, 0);
  textAlign(CENTER, CENTER);
  textSize(50);
  text("YOU WIN!", width / 2, height / 2 - 60);

  fill(255);
  textSize(28);
  text("PUNTUACIÓN FINAL: " + score, width / 2, height / 2);

  textSize(20);
  fill(255, 255, 0);
  text("Presiona R para reiniciar", width / 2, height / 2 + 60);
}

// =========================
// REINICIAR
// =========================

function restartGame() {

  score = 0;
  level = 1;
  lives = 3;

  bullets = [];
  enemies = [];
  enemyBullets = [];
  powerUps = [];

  gameOver = false;

  player.x = width / 2;
  player.doubleShot = false;

  explosions = [];

  shieldActive = false;
  tripleShotActive = false;
  freezeActive = false;
  magnetActive = false;
  slowTimeActive = false;

  freezeTimer = 0;
  slowTimer = 0;

  gameoverSoundPlayed = false;
   
  gameState = "menu";
  spawnEnemies(level);

  stopAllMusic();
  music.loop();
}

function spawnEnemiesExtra(type, count) {
  for (let i = 0; i < count; i++) {
    enemies.push({
      x: random(50, width - 100),
      y: random(50, 200),
      w: type === "tank" ? 100 : 70,
      h: type === "tank" ? 100 : 70,
      speed: 2,
      hp: type === "tank" ? 3 : 1,
      maxHp: type === "tank" ? 3 : 1,
      type: type
    });
  }
}

function stopAllMusic() {
  if (music && music.isPlaying()) {
    music.stop();
  }
  if (menuMusic && menuMusic.isPlaying()) {
    menuMusic.stop();
  }
  if (victoryMusic && victoryMusic.isPlaying()) {
    victoryMusic.stop();
  }
  if (gameoverSound && gameoverSound.isPlaying()) {
    gameoverSound.stop();
  }
}