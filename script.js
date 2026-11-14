document.addEventListener('DOMContentLoaded', () => {
	const hero = document.querySelector('.hero');
	const h1 = document.querySelector('.hero__content h1');
	const heroMeta = document.querySelector('.hero__meta');
	if (!hero || !h1) return;

	h1.style.textShadow = '0 10px 20px rgba(0,0,0,0.14), 0 4px 8px rgba(99,102,241,0.1)';

	let targetX = 0;
	let targetY = 0;
	let currentX = 0;
	let currentY = 0;

	function onMove(e) {
		const rect = hero.getBoundingClientRect();
		const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
		const py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
		targetY = px * 18;
		targetX = py * -12;
		const direction = Math.abs(px) > Math.abs(py) ? (px > 0 ? 'right' : 'left') : (py > 0 ? 'down' : 'up');
		try { sessionStorage.setItem('mouseDirection', direction); } catch (err) {}
	}

	window.addEventListener('mousemove', onMove, { passive: true });

	function animateTitle() {
		currentX += (targetX - currentX) * 0.14;
		currentY += (targetY - currentY) * 0.14;
		h1.style.transform = `perspective(1200px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;
		requestAnimationFrame(animateTitle);
	}

	animateTitle();

	const scrollTargets = Array.from(document.querySelectorAll('.panel-card, .story-cloud, .story-media, .project-card'));
	scrollTargets.forEach(el => {
		el.style.transformStyle = 'preserve-3d';
		el.style.transition = 'transform 0.7s cubic-bezier(.22,.61,.36,1), opacity 0.55s ease-out';
		el.style.willChange = 'transform, opacity';
	});

	function updateScrollEffects() {
		const center = window.innerHeight * 0.5;
		scrollTargets.forEach(el => {
			const rect = el.getBoundingClientRect();
			const offset = rect.top + rect.height * 0.4 - center;
			const normalized = Math.max(-1, Math.min(1, offset / (window.innerHeight * 0.8)));
			const depth = normalized * 24;
			const tilt = normalized * 7;
			const opacity = 1 - Math.abs(normalized) * 0.28;
			el.style.transform = `translateY(${depth}px) rotateX(${tilt}deg) translateZ(${Math.abs(normalized) * 12}px)`;
			el.style.opacity = opacity;
		});
	}

	let isTicking = false;
	window.addEventListener('scroll', () => {
		if (!isTicking) {
			window.requestAnimationFrame(() => {
				updateScrollEffects();
				isTicking = false;
			});
			isTicking = true;
		}
	}, { passive: true });
	window.addEventListener('resize', () => {
		window.requestAnimationFrame(updateScrollEffects);
	});
	updateScrollEffects();

	if (heroMeta) {
		const quoteCard = document.createElement('div');
		quoteCard.className = 'quote-card';
		quoteCard.innerHTML = `<strong>Daily creative quote</strong><p class="quote-text">Loading inspiration...</p>`;
		heroMeta.appendChild(quoteCard);

		const projectCard = document.createElement('div');
		projectCard.className = 'quote-card';
		projectCard.innerHTML = `<strong>Local project insight</strong><p class="quote-text">Loading local project data...</p>`;
		heroMeta.appendChild(projectCard);

		const apiNote = document.createElement('div');
		apiNote.className = 'api-card';
		apiNote.textContent = 'This page uses local data only, no external dependencies required.';
		heroMeta.appendChild(apiNote);

		const quoteButton = document.createElement('button');
		quoteButton.type = 'button';
		quoteButton.className = 'button button--ghost';
		quoteButton.textContent = 'Refresh local data';
		quoteCard.appendChild(quoteButton);

		const localQuotes = [
			{ content: 'If you can imagine it, you can build it.', author: 'Creative Mind' },
			{ content: 'Build something that makes people feel something.', author: 'Design Studio' },
			{ content: 'Great work begins with a strong idea and careful execution.', author: 'Project Lead' },
			{ content: 'Your next project is the one that will change everything.', author: 'Dev Mentor' },
			{ content: 'Quality comes from caring deeply about the details.', author: 'Studio Founder' },
		];

		const localProjects = [
			{ title: 'Local homepage redesign', body: 'A portfolio landing page built with HTML, CSS, and JavaScript.' },
			{ title: 'Interactive experience demo', body: 'A local UI sample showcasing cursor effects and transitions.' },
			{ title: 'Portfolio contact section', body: 'A simple email link for project inquiries and collaborations.' },
		];

		let quoteIndex = 0;
		let projectIndex = 0;

		function showLocalQuote() {
			const data = localQuotes[quoteIndex];
			quoteCard.querySelector('.quote-text').textContent = `“${data.content}” — ${data.author}`;
		}

		function showLocalProject() {
			const data = localProjects[projectIndex];
			projectCard.querySelector('.quote-text').textContent = `${data.title} — ${data.body}`;
		}

		function refreshLocalContent() {
			quoteIndex = (quoteIndex + 1) % localQuotes.length;
			projectIndex = (projectIndex + 1) % localProjects.length;
			showLocalQuote();
			showLocalProject();
		}

		showLocalQuote();
		showLocalProject();
		quoteButton.addEventListener('click', refreshLocalContent);
	}

});




document.addEventListener('DOMContentLoaded', () => {
	const helpBtn = document.getElementById('help-btn');
	const helpModal = document.getElementById('help-modal');
	const helpClose = document.getElementById('help-close');
	const helpOverlay = document.getElementById('help-overlay');
	const helpTabs = document.querySelectorAll('.help-tab');
	const helpPanels = document.querySelectorAll('.help-panel');

	if (!helpBtn || !helpModal) return;

	// Open modal
	helpBtn.addEventListener('click', () => {
		helpModal.classList.add('active');
		document.body.style.overflow = 'hidden';
	});

	// Close modal
	const closeModal = () => {
		helpModal.classList.remove('active');
		document.body.style.overflow = '';
	};

	helpClose?.addEventListener('click', closeModal);
	helpOverlay?.addEventListener('click', closeModal);

	// Tab switching
	helpTabs.forEach(tab => {
		tab.addEventListener('click', () => {
			const tabName = tab.getAttribute('data-tab');

			// Remove active class from all tabs and panels
			helpTabs.forEach(t => t.classList.remove('active'));
			helpPanels.forEach(p => p.classList.remove('active'));

			// Add active class to clicked tab and corresponding panel
			tab.classList.add('active');
			const panel = document.getElementById(tabName + '-panel');
			if (panel) {
				panel.classList.add('active');
			}
		});
	});

	// Close modal with Escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && helpModal.classList.contains('active')) {
			closeModal();
		}
	});
});

