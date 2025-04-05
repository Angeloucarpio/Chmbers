const pages = document.querySelectorAll('.page');
const pendingGroupEl = document.getElementById('groupPending');
const pendingPersonEl = document.getElementById('personPending');

let groups = [];
let persons = [];
let logs = [];

function showPage(id) {
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showPending(type) {
  pendingGroupEl.style.display = type === 'group' ? 'block' : 'none';
  pendingPersonEl.style.display = type === 'person' ? 'block' : 'none';
  renderPending();
}

function saveGroup() {
  const name = document.getElementById('groupName').value;
  const raw = document.getElementById('groupPeople').value.trim();
  const people = raw.split('\n').map(line => {
    const [n, price, qty] = line.split(',').map(s => s.trim());
    return { name: n, ticket: +price, qty: +qty, paid: 0 };
  });
  groups.push({ name, people });
  logAction(`${name} group saved with ${people.length} people`);
  alert("Group saved!");
}

function savePerson() {
  const name = document.getElementById('personName').value;
  const ticket = +document.getElementById('personTicketPrice').value;
  const qty = +document.getElementById('personTicketQty').value;
  persons.push({ name, ticket, qty, paid: 0 });
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
  renderPending();
}

function addTicket(groupName, personName) {
  const qty = +prompt("Add how many tickets?");
  const group = groups.find(g => g.name === groupName);
  const person = group.people.find(p => p.name === personName);
  person.qty += qty;
  logAction(`${personName} added ${qty} ticket(s)`);
  renderPending();
}

function addPaymentPerson(name) {
  const amount = +prompt("Enter payment amount:");
  const person = persons.find(p => p.name === name);
  person.paid += amount;
  logAction(`${name} added payment ${amount}`);
  renderPending();
}

// Show Home by default
showPage('home');
