import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Background = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        const particles = [];
        const particleCount = 100;

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 0.5;
                this.color = `rgba(${139 + Math.random() * 50}, ${92 + Math.random() * 50}, ${246}, ${Math.random() * 0.5 + 0.1})`; // Purple hues
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Create a black background with a subtle purple tint
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#05020b'); // Very dark, almost black with purple hint
            gradient.addColorStop(1, '#120520'); // Slightly lighter dark purple
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();

        // GSAP Animations for larger floating elements
        const floatingElements = document.querySelectorAll('.floating-orb');

        floatingElements.forEach((el, index) => {
            gsap.to(el, {
                x: 'random(-100, 100)',
                y: 'random(-100, 100)',
                duration: 'random(10, 20)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 2
            });

            gsap.to(el, {
                scale: 'random(0.8, 1.2)',
                duration: 'random(5, 10)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />

            {/* Large glowing orbs for atmosphere */}
            <div className="floating-orb" style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none'
            }} />

            <div className="floating-orb" style={{
                position: 'absolute',
                top: '70%',
                right: '10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(109, 40, 217, 0.1) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none'
            }} />

            <div className="floating-orb" style={{
                position: 'absolute',
                bottom: '-10%',
                left: '40%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(196, 181, 253, 0.05) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(60px)',
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default Background;
