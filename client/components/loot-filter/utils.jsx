export const fetchPoeNinjaData = async (setPoeNinjaData, minChaos) => {
  const res = await fetch(`/api/poe-ninja?minChaos=${minChaos}`);
  if (res.status === 200) {
    setPoeNinjaData(await res.json());
  }
};
