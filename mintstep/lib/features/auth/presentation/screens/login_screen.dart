import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mintstep/core/theme/design_system.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      // Simulate a responsive network/auth latency of 1 second
      Future.delayed(const Duration(milliseconds: 1000), () {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
          // Redirect to steps dashboard
          context.go('/dashboard');
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: theme.colorScheme.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 40),
                
                // Friendly Header Section
                Center(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isDark 
                          ? MintStepDesignSystem.primaryContainerDark 
                          : MintStepDesignSystem.primaryContainerLight,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.shield_rounded,
                      size: 40,
                      color: isDark 
                          ? MintStepDesignSystem.primaryDark 
                          : MintStepDesignSystem.primaryLight,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                
                Text(
                  'Welcome to MintStep',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.extrabold,
                    color: isDark ? Colors.white : MintStepDesignSystem.secondaryLight,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Secure Financial Walk Portal',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: isDark ? MintStepDesignSystem.outlineDark : MintStepDesignSystem.outlineLight,
                  ),
                ),
                const SizedBox(height: 40),

                // Email Input Field (Styled with M3 outline and active mint outline)
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  style: TextStyle(
                    fontFamily: MintStepDesignSystem.fontFamily,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                  decoration: InputDecoration(
                    labelText: 'Secure Email Address',
                    prefixIcon: const Icon(Icons.email_outlined),
                    border: OutlineInputBorder(
                      borderRadius: MintStepDesignSystem.borderMd,
                    ),
                    floatingLabelStyle: TextStyle(
                      color: isDark ? MintStepDesignSystem.primaryDark : MintStepDesignSystem.primaryLight,
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: MintStepDesignSystem.borderMd,
                      borderSide: BorderSide(
                        color: isDark ? MintStepDesignSystem.primaryDark : MintStepDesignSystem.primaryLight,
                        width: 2.0,
                      ),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your email to proceed';
                    }
                    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                      return 'Please enter a valid financial email profile';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),

                // Password Input Field
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  style: TextStyle(
                    fontFamily: MintStepDesignSystem.fontFamily,
                    color: isDark ? Colors.white : Colors.black,
                  ),
                  decoration: InputDecoration(
                    labelText: 'Password',
                    prefixIcon: const Icon(Icons.lock_outlined),
                    suffixIcon: IconButton(
                      icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
                      onPressed: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                    ),
                    border: OutlineInputBorder(
                      borderRadius: MintStepDesignSystem.borderMd,
                    ),
                    floatingLabelStyle: TextStyle(
                      color: isDark ? MintStepDesignSystem.primaryDark : MintStepDesignSystem.primaryLight,
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: MintStepDesignSystem.borderMd,
                      borderSide: BorderSide(
                        color: isDark ? MintStepDesignSystem.primaryDark : MintStepDesignSystem.primaryLight,
                        width: 2.0,
                      ),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Password is required';
                    }
                    if (value.length < 6) {
                      return 'Security threshold requires at least 6 characters';
                    }
                    return null;
                  },
                ),
                
                // Forgot password action
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Password recovery link has been dispatched to your email.')),
                      );
                    },
                    child: const Text('Forgot Password?'),
                  ),
                ),
                const SizedBox(height: 24),

                // Core Login Action Button
                FilledButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  child: _isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Sign In Securely'),
                ),
                const SizedBox(height: 16),

                // Biometrics Access Option (Friendly & Modern)
                OutlinedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Biometrics recognized. Syncing step credentials...')),
                    );
                    context.go('/dashboard');
                  },
                  icon: const Icon(Icons.fingerprint_rounded),
                  label: const Text('Access with Biometrics'),
                ),
                
                const SizedBox(height: 40),
                
                // Footer details
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Don't have a secure wallet?",
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: isDark ? MintStepDesignSystem.outlineDark : MintStepDesignSystem.outlineLight,
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Registration portal is temporarily locked. Access is invitation-only.')),
                        );
                      },
                      child: const Text('Create Profile'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
