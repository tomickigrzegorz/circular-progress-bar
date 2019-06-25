const stroke = document.querySelector('#stroke');
const percentNumber = document.querySelector('.percent');
const percent = 65;
const end = 264;

function circularProgressBar() {
  for (let i = 0; i <= end; i++) {
    setTimeout(() => {
      if(i > percent) return;
      percentNumber.innerHTML = `${i}%`;
      let d = parseInt(i * 2.64);
      stroke.setAttribute('stroke-dasharray', `${d} ${end - d}`);
    }, i * 30);
  }
}

window.addEventListener('DOMContentLoaded', circularProgressBar());
