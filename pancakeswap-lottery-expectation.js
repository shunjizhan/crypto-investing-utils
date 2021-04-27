const axios = require('axios');
const { table } = require('table');

const BASE_URL = 'https://api.pancakeswap.com/api/lottery';

const getPage = async (x, size=100) => {
  const res = await axios.get(`${BASE_URL}?page=${x}&pageSize=${size}`);
  return res.data;
};

const getInfo = async () => {
  const res = await getPage(0);
  const { totalPage, lotteries } = res;
  let all = [...lotteries];

  for (let i = 1; i <= totalPage; i++) {
    const res = await getPage(i);
    const { totalPage, lotteries } = res;
    all = [...all, ...lotteries];
  }

  return all;
};

const calcInfo = allInfo => {
  const n = allInfo.length;
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;

  allInfo.forEach(({ numbers2 }) => {
    const [_a, _b, _c, _d] = numbers2;
    a += _a;
    b += _b;
    c += _c;
    d += _d;
  });

  const avg1 = a / n;
  const avg4 = b / n;
  const avg3 = c / n;
  const avg2 = d / n;

  return [avg4, avg3, avg2, avg1];      // average winners of all history rounds
}

const getExpectation = (awards, winners) => {
  const [a4, a3, a2] = awards;
  const [w4, w3, w2, w1] = winners;

  p0 = (13 / 14) * (13 / 14) * (13 / 14) * (13 / 14);
  p1 = (1 / 14) * (13 / 14) * (13 / 14) * (13 / 14) * 4;
  p2 = (1 / 14) * (1 / 14) * (13 / 14) * (13 / 14) * 6;
  p3 = (1 / 14) * (1 / 14) * (1 / 14) * (13 / 14) * 4;
  p4 = (1 / 14) * (1 / 14) * (1 / 14) * (1 / 14) * 1;

  exp2 = a2 * p2;
  exp3 = a3 * p3;
  exp4 = a4 * p4;

  real2 = exp2 / w2;
  real3 = exp3 / w3;
  real4 = exp4 / w4;

  exp = real2 + real3 + real4

  const formatPercent = x => `${toFixedDecimal(5)(x * 100)}%`;
  const toFixedDecimal = decimal => x => parseFloat(parseFloat(x).toFixed(decimal));
  const toFixed2 = toFixedDecimal(2);

  const res = table([
    ['No. Matched', 'chance', 'expectation (cake)', 'divided by (ppl)', 'real expectation (cake)'],
    [4, formatPercent(p4), toFixed2(exp4), toFixed2(w4), toFixed2(real4)],
    [3, formatPercent(p3), toFixed2(exp3), toFixed2(w3), toFixed2(real3)],
    [2, formatPercent(p2), toFixed2(exp2), toFixed2(w2), toFixed2(real2)],
    [1, formatPercent(p1), 0, toFixed2(w1), 0],
    [0, formatPercent(p0), 0, 0, 0],
  ]);
  
  console.log(res);
  console.log(exp);
}

(async () => {
  const all = await getInfo();
  const winners = calcInfo(all);

  const awards = [11079, 4431, 2216];
  getExpectation(awards, winners);
})();

// console.log(getExpectation(12672, 25344, 63361));