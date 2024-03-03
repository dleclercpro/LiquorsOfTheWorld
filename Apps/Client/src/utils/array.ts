export const getRandom = <V> (arr: V[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const toSortedArr = (obj: Record<string, number>, order: 'ASC' | 'DESC' = 'ASC') => {
  const arr = Object.entries(obj);
  let sortedArr = arr;

  if (order === 'ASC') {
      sortedArr = arr.sort((a, b) => a[1] - b[1]);
  }
  if (order === 'DESC') {
      sortedArr = arr.sort((a, b) => b[1] - a[1]);
  }

  return sortedArr.map(([ key, value ]) => ({ key, value }));
}