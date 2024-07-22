const table = document.getElementById('config-table');
const doneBtn = document.getElementById('done-btn');
const searchIn = document.getElementById('search');
const showSelected = document.getElementById('show-selected');
let tableConfig = [];

const API_RES = [
  {
    key: 'product_count',
    label: 'Products Count',
    field: {
      defaultValue: '30',
      type: 'text',
    },
    description: 'Max Products Count',
    selected: true,
  },
  {
    key: 'product_type',
    label: 'Products Type',
    field: {
      defaultValue: '',
      type: 'text',
    },
    description: 'Gives Product Type information',
    selected: false,
  },
  {
    key: 'listing_count',
    label: 'Listing Count',
    field: {
      defaultValue: '3',
      type: 'text',
    },
    description: 'Number of listings per product',
    selected: false,
  },
  {
    key: 'geo_browse',
    label: 'Geo Browse',
    field: {
      defaultValue: 'disabled',
      options: ['enabled', 'disabled'],
      type: 'select',
    },
    description: 'Get zone level ordering of products',
    selected: true,
  },
  {
    key: 'client_tag',
    label: 'Client Tag',
    field: {
      defaultValue: 'mobile-apps-retail',
      type: 'text',
    },
    description: 'Client Tag',
    selected: false,
  },
  {
    key: 'pincode',
    label: 'Pincode',
    field: {
      defaultValue: '560103',
      type: 'text',
    },
    description: 'Pincode to search in',
    selected: true,
  },
  {
    key: 'disable_cache',
    label: 'Disable Cache',
    field: {
      defaultValue: 'false',
      options: ['true', 'false'],
      type: 'select',
    },
    description: 'Disable augmentation cache',
    selected: false,
  },
];

const createTableUI = (tableConfig) => {
  const thEl = document.createElement('tr');
  thEl.innerHTML = `<th>Key</th>
                    <th>Value</th>
                    <th>Description</th>`;
  table.appendChild(thEl);

  tableConfig.forEach((cnf, index) => {
    const trEl = document.createElement('tr');
    if (cnf.field.type === 'text') {
      trEl.innerHTML = `<td>
                            <input class='key-checkbox' 
                            type="checkbox" name="${cnf.key}" 
                            ${cnf.selected ? 'checked' : ''} 
                            onclick="checkRecord('${index}')" />
                            
                            <label for="${cnf.key}">${cnf.label}</label>
                        </td>
                        <td>
                            <input type="text"
                            ${!cnf.selected ? 'disabled' : ''}
                            value=${cnf.field.defaultValue}  >
                        </td>
                        <td>${cnf.description}</td>`;
    }

    if (cnf.field.type === 'select') {
      // const selectEl = document.createElement('select');
      let options = '';
      cnf.field.options.forEach((option) => {
        options += `<option value="${option}">${option}</option>`;
      });

      trEl.innerHTML = `<td>
                            <input class='key-checkbox' 
                            type="checkbox" 
                            name="${cnf.key}" 
                            ${cnf.selected ? 'checked' : ''} 
                            onclick="checkRecord('${index}')" />

                            <label for="${cnf.key}">${cnf.label}</label>
                        </td>
                        <td>
                            <select name="${cnf.key}" 
                            id="${cnf.key}"
                            ${!cnf.selected ? 'disabled' : ''} >
                            ${options}
                            </select>
                        </td>
                        <td>${cnf.description}</td>`;
    }
    table.appendChild(trEl);
  });
};

const renderUI = async (e) => {
  // const config = await fetchTableConfiguration();
  // tableConfig = config.config;
  tableConfig = API_RES;
  createTableUI(tableConfig);
  console.log(tableConfig);
};

async function fetchTableConfiguration() {
  // Get Data From Flipkart API
  const res = await fetch('https://flipkart-configuration-table.now.sh/api');
  const data = await res.json();
  return data;
}

function checkRecord(index) {
  const currState = tableConfig[index].selected;
  const newState = currState ? false : true;
  tableConfig[index].selected = newState;
  // table.innerHTML = '';
  // createTableUI(tableConfig);
}

function doneHandler() {
  const displayLog = tableConfig.reduce((acc, cnf) => {
    if (cnf.selected) acc[cnf.key] = cnf.field.defaultValue;
    return acc;
  }, {});
  console.log(displayLog);
}

function searchRecords(e) {
  console.log(e.target.value);
  const searchKey = e.target.value.toLowerCase();

  const newTableConfig = tableConfig.filter((cnf) => {
    if (
      cnf.key.toLowerCase().includes(searchKey) ||
      cnf.description.toLowerCase().includes(searchKey)
    ) {
      return cnf;
    }
  });
  table.innerHTML = '';
  createTableUI(newTableConfig);
}

let showFlag = false;

function showSelectedRows(e) {
  if (!showFlag) {
    const newTableConfig = tableConfig.filter((cnf) => {
      if (cnf.selected) return cnf;
    });

    table.innerHTML = '';
    createTableUI(newTableConfig);
    showFlag = true;
  } else {
    table.innerHTML = '';
    createTableUI(tableConfig);
    showFlag = false;
  }
}

window.addEventListener('DOMContentLoaded', renderUI);
doneBtn.addEventListener('click', doneHandler);
showSelected.addEventListener('click', showSelectedRows);
searchIn.oninput = searchRecords;
