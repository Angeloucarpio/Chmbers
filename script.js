const pages = document.querySelectorAll('.page');
const pendingGroupEl = document.getElementById('groupPending');
const pendingPersonEl = document.getElementById('personPending');

let groups = JSON.parse(localStorage.getItem('groups')) || [];
let persons = JSON.parse(localStorage.getItem('persons')) || [];
let logs = [];

let activeMenu = null;

document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('nav ul li');
  menuItems.forEach(item => {
    item.addEventListener('click', (event) => {
      toggleDropdown(event.target);
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('nav')) {
      closeAllDropdowns();
    }
  });
});

function toggleDropdown(target) {
  if (activeMenu === target) {
    closeAllDropdowns();
  } else {
    closeAllDropdowns();
    target.classList.add('active');
    activeMenu = target;
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('nav ul li').forEach(item => {
    item.classList.remove('active');
  });
  activeMenu = null;
}

function showPage(id) {
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showPending(type) {
  pendingGroupEl.style.display = type === 'group' ? 'block' : 'none';
  pendingPersonEl.style.display = type === 'person' ? 'block' : 'none';
  renderPending();
}

function addPersonField() {
  const container = document.getElementById('groupPeopleContainer');
  const newPersonField = document.createElement('div');
  newPersonField.classList.add('groupPersonEntry');
  newPersonField.innerHTML = ` 
    <input type="text" class="groupName" placeholder="Name">
    <input type="number" class="ticketPrice" placeholder="Ticket Price">
    <input type="number" class="ticketQty" placeholder="Quantity">`;
  container.appendChild(newPersonField);
}

function saveGroup() {
  const name = document.getElementById('groupName').value;
  const groupEntries = document.querySelectorAll('.groupPersonEntry');
  const people = [];

  groupEntries.forEach(entry => {
    const personName = entry.querySelector('.groupName').value;
    const ticketPrice = +entry.querySelector('.ticketPrice').value;
    const ticketQty = +entry.querySelector('.ticketQty').value;
    if (personName && ticketPrice && ticketQty) {
      people.push({ name: personName, ticket: ticketPrice, qty: ticketQty, paid: 0 });
    }
  });

  if (people.length > 0) {
    groups.push({ name, people });
    localStorage.setItem('groups', JSON.stringify(groups));
    logAction(`${name} group saved with ${people.length} people`);
    alert("Group saved!");
  }
}

function savePerson() {
  const name = document.getElementById('personName').value;
  const ticket = +document.getElementById('personTicketPrice').value;
  const qty = +document.getElementById('personTicketQty').value;
  persons.push({ name, ticket, qty, paid: 0 });
  localStorage.setItem('persons', JSON.stringify(persons));
  logAction(`${name} person saved`);
  alert("Person saved!");
}

function logAction(action) {
  const time = new Date().toLocaleString();
  logs.push(`${action} on ${time}`);
}

function renderPending() {
  // Group
  pendingGroupEl.innerHTML = `<h2>Pending Groups</h2>` + groups.map(g => {
    let members = g.people.map(p => {
      const bal = (p.ticket * p.qty) - p.paid;
      return `<li>${p.name} - Tickets: ${p.qty}, Balance: ${bal}
        <button onclick="addPayment('${g.name}', '${p.name}')">Add Payment</button>
        <button onclick="addTicket('${g.name}', '${p.name}')">Add Ticket</button>
      </li>`;
    }).join('');
    return `<div><h3>${g.name}</h3><ul>${members}</ul></div>`;
  }).join('');

  // Person
  pendingPersonEl.innerHTML = `<h2>Pending Persons</h2>` + persons.map(p => {
    const bal = (p.ticket * p.qty) - p.paid;
    return `<div>${p.name} - Tickets: ${p.qty}, Balance: ${bal}
      <button onclick="addPaymentPerson('${p.name}')">Add Payment</button>
    </div>`;
  }).join('');
}

function addPayment(groupName, personName) {
  const amount = +prompt("Enter payment amount:");
  const group = groups.find(g => g.name === groupName);
  const person = group.people.find(p => p.name === personName);
  person.paid += amount;
  logAction(`${personName} added payment ${amount}`);
  localStorage.setItem('groups', JSON.stringify(groups));
  renderPending();
}

function addTicket(groupName, personName) {
  const qty = +prompt("Add how many tickets?");
  const group = groups.find(g => g.name === groupName);
  const person = group.people.find(p => p.name === personName);
  person.qty += qty;
  logAction(`${personName} added ${qty} ticket(s)`);
  localStorage.setItem('groups', JSON.stringify(groups));
  renderPending();
}

function addPaymentPerson(name) {
  const amount = +prompt("Enter payment amount:");
  const person = persons.find(p => p.name === name);
  person.paid += amount;
  logAction(`${name} added payment ${amount}`);
  localStorage.setItem('persons', JSON.stringify(persons));
  renderPending();
}

// Show Home by default
showPage('home');
