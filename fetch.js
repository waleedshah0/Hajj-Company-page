

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('form1');
  
    signupForm.addEventListener('submit', async (event) => { // Change 'button' to 'submit'
      event.preventDefault();
  
      const formData = new FormData(signupForm);
      const data = {};
  
      formData.forEach((value, key) => {
        data[key] = value;
      });
  
      const response = await fetch('http://localhost:3000/fetch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});

const result = await response.json();
console.log(result);

if (result.nextStep) {
  window.location.href = result.nextStep;
}

    });
});

  
