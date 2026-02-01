//let A = {
//  troops: 45000,
//  firepower: 1.1,
//  discipline: 1.0,
//  command: 1.2,
//  supply: 1.0,
//  terrain: 1.1,
//  biome: 1.25,
//  morale: 1.0,
//  unity: 1.0
//};
//let B = {
//  troops: 25000,
//  firepower: 1.1,
//  discipline: 1.0,
//  command: 1.2,
//  supply: 1.0,
//  terrain: 1.1,
//  biome: 1.25,
//  morale: 1.0,
//  unity: 0.25
//};

const lossNormalAmount = 0.1
const MaxLoss = 0.8
const FrontlineCollapse = 0.5
const DisciplineMax = 1.2
const MaxStress = 1.3

const formatVal = (val,precise = 3) =>{
  return Number(val).toFixed(precise)
}

function battle() {
  var Text_A = document.getElementById("textA").value;
  var Text_B = document.getElementById("textB").value;
  const power1 =
    const A = Text_A.split(",").map(s => Number(s.trim())).filter(n => !Number.isNaN(n)).reduce((acc, n) => acc * n, 1); //A.troops*A.firepower*A.discipline*A.command*A.supply*A.terrain*A.biome*A.morale*A.unity;

  const power2 =
    const B = Text_A.split(",").map(s => Number(s.trim())).filter(n => !Number.isNaN(n)).reduce((acc, n) => acc * n, 1); //B.troops*B.firepower*B.discipline*B.command*B.supply*B.terrain*B.biome*B.morale*B.unity;
const ratio1 = power1/(power1 + power2);
  const ratio2 = 1-ratio1;

  const lossFrac1 = Math.min(MaxLoss, lossNormalAmount + FrontlineCollapse * ratio1 * (DisciplineMax - A.discipline) * (Math.random()*Math.random()*0.1));
  const lossFrac2 = Math.min(MaxLoss, lossNormalAmount + FrontlineCollapse * ratio2 * (DisciplineMax - B.discipline) * (Math.random()*Math.random()*0.1));

  let losses1 = Math.round(A.troops * lossFrac1);
  let losses2 = Math.round(B.troops * lossFrac2);

  const moraleDamage1 = lossFrac1 * (MaxStress - A.discipline);
  const moraleDamage2 = lossFrac2 * (MaxStress - B.discipline);

  const LowMorale1 = A.morale - moraleDamage1 <= 0.25;
  const LowMorale2 = B.morale - moraleDamage2 <= 0.25;
  A.unity -= formatVal(lossFrac1 * (MaxStress - B.command) * Math.random() * 24.99,2);
  B.unity -= formatVal(lossFrac1 * (MaxStress - B.command) * Math.random() * 24.99,2);
  A.morale -= moraleDamage1 * Math.random() * 2.99
  B.morale -= moraleDamage2 * Math.random() * 2.99
  A.supply -= lossFrac1 * (MaxStress - (Math.random() * 16.59 * 0.1 * (B.terrain/A.terrain) * (B.biome/A.biome)))
  B.supply -= lossFrac1 * (MaxStress - (Math.random() * 16.59 * 0.1 * (A.terrain/B.terrain) * (A.biome/B.biome)))

  if (LowMorale1 && !LowMorale2) {
    losses1 += Math.round(
      (A.troops - losses1) * 0.1 * (B.command / A.command)
    );
  }

  if (LowMorale2 && !LowMorale1) {
    losses2 += Math.round(
      (B.troops - losses2) * 0.1 * (A.command / B.command)
    );
  }
  var captured1=0;
  var captured2=0;
  if (A.unity <= 0.25) {
    captured1 = Math.round(Math.max(0, A.troops - losses1) * 0.28);
  }
  if (B.unity <= 0.25) {
    captured2 = Math.round(Math.max(0, B.troops - losses1) * 0.28);
  }

  let winner = "stalemate";
  if (LowMorale1 && !LowMorale2) winner = "B";
  else if (LowMorale2 && !LowMorale1) winner = "A";
  else if (power1 > power2) winner = "A";
  else if (power2 > power1) winner = "B";
  A_remaining = Math.max(0, A.troops - losses1 - captured1);
  B_remaining = Math.max(0, B.troops - losses2 - captured2);
  A.troops = A_remaining;
  B.troops = B_remaining;

  return {
    winner,
    A_New: A,
    B_New: B,
    A_losses: losses1,
    B_losses: losses2,
    Retreat1: LowMorale1,
    Retreat2: LowMorale2,
    A_captured: captured1,
    B_captured: captured2
  };
}
