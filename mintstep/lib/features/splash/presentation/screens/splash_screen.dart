import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mintstep/core/theme/design_system.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();

    // 1. Setup the 60fps Animation Controller for exactly 1500ms within the 2s lifespan
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    // 2. Custom Bezier Curve for ultra-smooth friendly deceleration physics
    final curvedAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutBack,
    );

    // 3. Define micro-interactions: Pop-in scale, rotate-in, and elegant fade
    _scaleAnimation = Tween<double>(begin: 0.3, end: 1.0).animate(curvedAnimation);
    _rotationAnimation = Tween<double>(begin: -0.2, end: 0.0).animate(curvedAnimation);
    
    _opacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.7, curve: Curves.easeIn),
      ),
    );

    // Start animating immediately
    _animationController.forward();

    // 4. Force clean, fluid redirection after exactly 2.0 seconds
    Timer(const Duration(milliseconds: 2000), () {
      if (mounted) {
        context.go('/login');
      }
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Gradient background: financial deep emerald gradient or premium dark mint
    final backgroundGradient = isDark
        ? const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF070B08),
              Color(0xFF0F1713),
              Color(0xFF070B08),
            ],
            stops: [0.0, 0.5, 1.0],
          )
        : const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFE8FDF3),
              Color(0xFFFAFFFC),
              Color(0xFFF3FDF8),
            ],
            stops: [0.0, 0.6, 1.0],
          );

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(gradient: backgroundGradient),
        child: Stack(
          children: [
            // Decorative background radial circles
            Positioned(
              top: -100,
              right: -100,
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: (isDark ? MintStepDesignSystem.primaryDark : MintStepDesignSystem.primaryLight)
                      .withOpacity(isDark ? 0.03 : 0.07),
                ),
              ),
            ),
            
            // Core centered branding content
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // 5. 60fps Animated MintStep Logo with combined Scale, Rotation, and Opacity
                  AnimatedBuilder(
                    animation: _animationController,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: _scaleAnimation.value,
                        child: Transform.rotate(
                          angle: _rotationAnimation.value,
                          child: Opacity(
                            opacity: _opacityAnimation.value,
                            child: child,
                          ),
                        ),
                      );
                    },
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        color: isDark 
                            ? MintStepDesignSystem.primaryContainerDark 
                            : MintStepDesignSystem.primaryContainerLight,
                        borderRadius: MintStepDesignSystem.borderXxl,
                        boxShadow: isDark
                            ? [
                                BoxShadow(
                                  color: MintStepDesignSystem.primaryDark.withOpacity(0.12),
                                  blurRadius: 24,
                                  offset: const Offset(0, 12),
                                )
                              ]
                            : [
                                BoxShadow(
                                  color: MintStepDesignSystem.primaryLight.withOpacity(0.18),
                                  blurRadius: 20,
                                  offset: const Offset(0, 8),
                                )
                              ],
                      ),
                      child: Center(
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Icon(
                              Icons.nordic_walking_rounded,
                              size: 52,
                              color: isDark 
                                  ? MintStepDesignSystem.primaryDark 
                                  : MintStepDesignSystem.primaryLight,
                            ),
                            // Micro mint coin ornament representing "Wealth"
                            Positioned(
                              top: 20,
                              right: 20,
                              child: Container(
                                width: 10,
                                height: 10,
                                decoration: const BoxDecoration(
                                  color: Colors.amber,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // 6. Title and Tagline Fade & Slide Translation
                  AnimatedBuilder(
                    animation: _animationController,
                    builder: (context, child) {
                      return Opacity(
                        opacity: _opacityAnimation.value,
                        child: Transform.translate(
                          offset: Offset(0, 20 * (1 - _opacityAnimation.value)),
                          child: child,
                        ),
                      );
                    },
                    child: Column(
                      children: [
                        Text(
                          'MintStep',
                          style: Theme.of(context).textTheme.displaySmall?.copyWith(
                                fontWeight: FontWeight.extrabold,
                                letterSpacing: -0.5,
                                color: isDark ? Colors.white : MintStepDesignSystem.secondaryLight,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Every Step Builds Wealth',
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                color: isDark 
                                    ? MintStepDesignSystem.primaryDark 
                                    : MintStepDesignSystem.primaryLight,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                              ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            // Bottom minimalist copyright/technical loading indicator
            Positioned(
              bottom: 40,
              left: 0,
              right: 0,
              child: Center(
                child: Column(
                  children: [
                    SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.2,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          isDark ? MintStepDesignSystem.primaryDark : MintStepDesignSystem.primaryLight,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'SECURE FINANCIAL PORTAL',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: (isDark ? Colors.white : Colors.black).withOpacity(0.3),
                            letterSpacing: 2.0,
                          ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
