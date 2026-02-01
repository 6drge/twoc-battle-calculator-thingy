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
  const A = Text_A.split(",").map(s => Number(s.trim()))
  const B = Text_B.split(",").map(s => Number(s.trim()))
  const power1 =
    A.filter(n => !Number.isNaN(n)).reduce((acc, n) => acc * n, 1); //A[0]*A.firepower*A[2]*A[3]*A[4]*A[5]*A[6]*A[7]*A[8];

  const power2 =
    B.filter(n => !Number.isNaN(n)).reduce((acc, n) => acc * n, 1); //B[0]*B.firepower*B[2]*B[3]*B[4]*B[5]*B[6]*B[7]*B[8];
const ratio1 = power1/(power1 + power2);
  const ratio2 = 1-ratio1;

  const lossFrac1 = Math.min(MaxLoss, lossNormalAmount + FrontlineCollapse * ratio1 * (DisciplineMax - A[2]) * (Math.random()*Math.random()*0.1));
  const lossFrac2 = Math.min(MaxLoss, lossNormalAmount + FrontlineCollapse * ratio2 * (DisciplineMax - B[2]) * (Math.random()*Math.random()*0.1));

  let losses1 = Math.round(A[0] * lossFrac1);
  let losses2 = Math.round(B[0] * lossFrac2);

  const moraleDamage1 = lossFrac1 * (MaxStress - A[2]);
  const moraleDamage2 = lossFrac2 * (MaxStress - B[2]);

  const LowMorale1 = A[7] - moraleDamage1 <= 0.25;
  const LowMorale2 = B[7] - moraleDamage2 <= 0.25;
  A[8] -= formatVal(lossFrac1 * (MaxStress - B[3]) * Math.random() * 24.99,2);
  B[8] -= formatVal(lossFrac1 * (MaxStress - B[3]) * Math.random() * 24.99,2);
  A[1] -= lossFrac1 * (MaxStress - (Math.random() * 16.59 * 0.1 * (B[1]/A[1]) * (B[3]/A[3])))
  B[1] -= lossFrac1 * (MaxStress - (Math.random() * 16.59 * 0.1 * (A[1]/B[1]) * (A[3]/B[3])))
  A[7] -= moraleDamage1 * Math.random() * 2.99
  B[7] -= moraleDamage2 * Math.random() * 2.99
  A[4] -= lossFrac1 * (MaxStress - (Math.random() * 16.59 * 0.1 * (B[5]/A[5]) * (B[6]/A[6])))
  B[4] -= lossFrac1 * (MaxStress - (Math.random() * 16.59 * 0.1 * (A[5]/B[5]) * (A[6]/B[6])))
  A[3] -= lossFrac1 * (MaxStress - (Math.random() * 16.59 * 0.1 * (B[8]/A[8]) * (B[2]/A[2])))
  B[3] -= lossFrac1 * (MaxStress - (Math.random() * 16.59 * 0.1 * (A[8]/B[8]) * (A[2]/B[2])))

  if (LowMorale1 && !LowMorale2) {
    losses1 += Math.round(
      (A[0] - losses1) * 0.1 * (B[3] / A[3])
    );
  }

  if (LowMorale2 && !LowMorale1) {
    losses2 += Math.round(
      (B[0] - losses2) * 0.1 * (A[3] / B[3])
    );
  }
  var captured1=0;
  var captured2=0;
  if (A[8] <= 0.25) {
    captured1 = Math.round(Math.max(0, A[0] - losses1) * 0.28);
  }
  if (B[8] <= 0.25) {
    captured2 = Math.round(Math.max(0, B[0] - losses1) * 0.28);
  }

  let winner = "stalemate";
  if (LowMorale1 && !LowMorale2) winner = "B";
  else if (LowMorale2 && !LowMorale1) winner = "A";
  else if (power1 > power2) winner = "A";
  else if (power2 > power1) winner = "B";
  A_remaining = Math.max(0, A[0] - losses1 - captured1);
  B_remaining = Math.max(0, B[0] - losses2 - captured2);
  A[0] = A_remaining;
  B[0] = B_remaining;

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
