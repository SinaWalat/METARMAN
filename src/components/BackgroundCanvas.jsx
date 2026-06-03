import React, { useEffect, useRef } from 'react';

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ y: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 100;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 100;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll tracking
    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    // Wave layers setup
    const waves = [
      { amplitude: 50, frequency: 0.002, speed: 0.005, phase: 0, color: 'rgba(255, 255, 255, 0.03)', lineWidth: 1 },
      { amplitude: 70, frequency: 0.0015, speed: 0.003, phase: Math.PI / 4, color: 'rgba(255, 255, 255, 0.04)', lineWidth: 1.5 },
      { amplitude: 40, frequency: 0.003, speed: 0.008, phase: Math.PI / 2, color: 'rgba(255, 255, 255, 0.02)', lineWidth: 1 },
      { amplitude: 90, frequency: 0.001, speed: 0.002, phase: Math.PI * 0.75, color: 'rgba(255, 255, 255, 0.05)', lineWidth: 2 },
    ];



    // Render loop
    const render = () => {
      // Lerp mouse and scroll for smooth inertia
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const scroll = scrollRef.current;
      scroll.y += (scroll.targetY - scroll.y) * 0.05;

      // Clear canvas with a solid black trail
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw flowing waves
      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.lineWidth;

        // Baseline position is centered vertically, shifted by scroll and mouse Y
        const centerY = canvas.height * 0.5 + (mouse.y * (index + 1) * 0.3) - (scroll.y * 0.15);

        for (let x = 0; x < canvas.width; x += 5) {
          // Add complex noise-like wave pattern by combining primary frequency + mouse X shift
          const mouseXFactor = mouse.x * 0.0001;
          const y = centerY + Math.sin(x * (wave.frequency + mouseXFactor) + wave.phase) * (wave.amplitude + mouse.y * 0.2);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        // Increment phase
        wave.phase += wave.speed;
      });



      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BackgroundCanvas;
