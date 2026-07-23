import 'package:flutter/material.dart';
import 'design_system.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get lightTheme {
    return MintStepDesignSystem.buildTheme(isDark: false);
  }

  static ThemeData get darkTheme {
    return MintStepDesignSystem.buildTheme(isDark: true);
  }
}

