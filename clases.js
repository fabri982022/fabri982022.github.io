document.addEventListener('DOMContentLoaded', function() {
	const filterInputs = document.querySelectorAll('input[name="filter"]');
	const classItems = document.querySelectorAll('.class-item');

	filterInputs.forEach(input => {
		input.addEventListener('change', function() {
			const category = this.id;

			classItems.forEach(item => {
				const shouldShow = category === 'all' || item.dataset.category === category;
				item.classList.toggle('filter-hidden', !shouldShow);
				item.setAttribute('aria-hidden', String(!shouldShow));
			});
		});
	});
});
