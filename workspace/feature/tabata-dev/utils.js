// Shared utility functions

let excuses = {};
let counterarguments = {};
let dataLoaded = false;

async function loadData() {
  try {
    const [excusesData, counterargumentsData] = await Promise.all([
      fetch('data.json').then(r => r.json()),
      fetch('counterarguments.json').then(r => r.json())
    ]);
    excuses = excusesData;
    counterarguments = counterargumentsData;
    dataLoaded = true;
    return true;
  } catch (error) {
    console.error('Error loading data:', error);
    return false;
  }
}

function isDataReady() {
  return dataLoaded && excuses.random && counterarguments.random;
}
