let groups = JSON.parse(localStorage.getItem('groups')) || [];
let persons = JSON.parse(localStorage.getItem('persons')) || [];

document.addEventListener('DOMContentLoaded', () => {
  // Show home by default
  showPage('home');
});

function showPage(id) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function loadPending(type) {
  const pendingSection = document.getElementById('pending');
  pendingSection.innerHTML = ''; // Clear any previous content

  if (type === 'group') {
    fetch('pending-group.html')
      .then(response => response.text())
      .then(data => {
        pendingSection.innerHTML = data;
        renderPendingGroup();
      });
  } else if (type === 'person') {
    fetch('pending-person.html')
      .then(response => response.text())
      .then(data => {
        pendingSection.innerHTML = data;
        renderPendingPerson();
      });
  }
}

function renderPendingGroup() {
  const container = document.getElementById('pendingGroupContainer');
  container.innerHTML = groups.map(group => {
    return `
      <div>
        <h3>${group.name}</h3>
        <ul>
          ${group.people.map(person => {
            const balance = (person.ticket * person.qty) - person.paid;
            return `
              <li>
                ${person.name} - Tickets: ${person.qty}, Balance: ${balance}
                <button onclick="addPayment('${group.name}', '${person.name}')">Add Payment</button>
                <button onclick="addTicket('${group.name}', '${person.name}')">Add Ticket</button>
              </li>
            `;
          }).join('')}
        </ul>
      </div>
    `;
  }).join('');
}

function renderPendingPerson() {
  const container = document.getElementById('pendingPersonContainer');
  container.innerHTML = persons.map(person => {
    const balance = (person.ticket * person.qty) - person.paid;
    return `
      <div>
        ${person.name} - Tickets: ${person.qty}, Balance: ${balance}
        <button onclick="addPaymentPerson('${person.name}')">Add Payment</button>
      </div>
    `;
  }).join('');
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
    alert("Group saved!");
  }
}

function savePerson() {
  const name = document.getElementById('personName').value;
  const ticket = +document.getElementById('personTicketPrice').value;
  const qty = +document.getElementById('personTicketQty').value;
  persons.push({ name, ticket, qty, paid: 0 });
  localStorage.setItem('persons', JSON.stringify(persons));
  alert("Person saved!");
}

function addPayment(groupName, personName) {
  const amount = +prompt("Enter payment amount:");
  const group = groups.find(g => g.name === groupName);
  const person = group.people.find(p => p.name === personName);
  person.paid += amount;
  localStorage.setItem('groups', JSON.stringify(groups));
  renderPendingGroup();
}

function addTicket(groupName, personName) {
  const qty = +prompt("Add how many tickets?");
  const group = groups.find(g => g.name === groupName);
  const person = group.people.find(p => p.name === personName);
  person.qty += qty;
  localStorage.setItem('groups', JSON.stringify(groups));
  renderPendingGroup();
}

function addPaymentPerson(name) {
  const amount = +prompt("Enter payment amount:");
  const person = persons.find(p => p.name === name);
  person.paid += amount;
  localStorage.setItem('persons', JSON.stringify(persons));
  renderPendingPerson();
}
