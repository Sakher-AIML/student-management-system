document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('.needs-validation');

    forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                alert('Please fill all required fields correctly.');
            }
        });
    });

    var deleteButtons = document.querySelectorAll('.confirm-delete');
    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            var ok = confirm('Are you sure you want to delete this record?');
            if (!ok) {
                event.preventDefault();
            }
        });
    });
});
