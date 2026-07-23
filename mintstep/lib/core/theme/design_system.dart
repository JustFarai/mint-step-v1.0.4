import 'package:flutter/material.dart';

/// MintStep Material Design 3 Design System
/// 
/// Brand Personality: Modern, Minimal, Financial, Friendly, Professional
/// This class defines cohesive design tokens for colors, typography, spacing,
/// shapes, shadows, and animation constants across light and dark modes.
class MintStepDesignSystem {
  MintStepDesignSystem._();

  // ==========================================
  // 1. Color Palette (Material Design 3 Key Colors)
  // ==========================================

  // Light Palette
  static const Color primaryLight = Color(0xFF00A86B);        // Emerald Mint (Friendly, Financial)
  static const Color onPrimaryLight = Colors.white;
  static const Color primaryContainerLight = Color(0xFFD1F7E4); // Soft mint container
  static const Color onPrimaryContainerLight = Color(0xFF003820);

  static const Color secondaryLight = Color(0xFF3B5E4F);      // Deep Slate Green (Professional)
  static const Color onSecondaryLight = Colors.white;
  static const Color secondaryContainerLight = Color(0xFFBDEAD0);
  static const Color onSecondaryContainerLight = Color(0xFF042014);

  static const Color tertiaryLight = Color(0xFF2C5E7A);       // Trust Blue (Financial, Professional)
  static const Color onTertiaryLight = Colors.white;
  static const Color tertiaryContainerLight = Color(0xFFD0E6F5);
  static const Color onTertiaryContainerLight = Color(0xFF001E2E);

  static const Color successLight = Color(0xFF198754);        // Secure Green
  static const Color onSuccessLight = Colors.white;
  
  static const Color errorLight = Color(0xFFBA1A1A);          // Warning Red
  static const Color onErrorLight = Colors.white;
  static const Color errorContainerLight = Color(0xFFFFDAD6);
  static const Color onErrorContainerLight = Color(0xFF410002);

  static const Color warningLight = Color(0xFFD67D00);        // Gold Warning
  static const Color onWarningLight = Colors.white;

  static const Color backgroundLight = Color(0xFFF8F9FA);     // Minimal Light Off-White
  static const Color onBackgroundLight = Color(0xFF191C1A);
  static const Color surfaceLight = Colors.white;
  static const Color onSurfaceLight = Color(0xFF191C1A);
  static const Color surfaceVariantLight = Color(0xFFDCE5DF); // Soft border/divider fill
  static const Color outlineLight = Color(0xFF707973);

  // Dark Palette
  static const Color primaryDark = Color(0xFF00E676);         // High Contrast Neon Mint
  static const Color onPrimaryDark = Color(0xFF003820);
  static const Color primaryContainerDark = Color(0xFF005231);
  static const Color onPrimaryContainerDark = Color(0xFF9FFCBF);

  static const Color secondaryDark = Color(0xFFB1CCBC);       // Muted Mint Grey
  static const Color onSecondaryDark = Color(0xFF1C3528);
  static const Color secondaryContainerDark = Color(0xFF324C3E);
  static const Color onSecondaryContainerDark = Color(0xFFCDEDD8);

  static const Color tertiaryDark = Color(0xFF97CBEC);        // Calm Financial Blue
  static const Color onTertiaryDark = Color(0xFF00344B);
  static const Color tertiaryContainerDark = Color(0xFF0C4962);
  static const Color onTertiaryContainerDark = Color(0xFFC3E8FF);

  static const Color successDark = Color(0xFF20C997);
  static const Color onSuccessDark = Color(0xFF003828);

  static const Color errorDark = Color(0xFFFFB4AB);
  static const Color onErrorDark = Color(0xFF690005);
  static const Color errorContainerDark = Color(0xFF93000A);
  static const Color onErrorContainerDark = Color(0xFFFFDAD6);

  static const Color warningDark = Color(0xFFFFC107);
  static const Color onWarningDark = Color(0xFF422B00);

  static const Color backgroundDark = Color(0xFF0F1110);      // Pure dark slate background
  static const Color onBackgroundDark = Color(0xFFE1E3E0);
  static const Color surfaceDark = Color(0xFF171A19);         // Elevated M3 dark card
  static const Color onSurfaceDark = Color(0xFFE1E3E0);
  static const Color surfaceVariantDark = Color(0xFF404944);
  static const Color outlineDark = Color(0xFF8A938C);

  // ==========================================
  // 2. Spacing System (4px Base Grid)
  // ==========================================
  static const double spaceXxxs = 2.0;
  static const double spaceXxs = 4.0;
  static const double spaceXs = 8.0;
  static const double spaceSm = 12.0;
  static const double spaceMd = 16.0;
  static const double spaceLg = 24.0;
  static const double spaceXl = 32.0;
  static const double spaceXxl = 48.0;
  static const double spaceXxxl = 64.0;

  // Convenient EdgeInsets
  static const EdgeInsets paddingAllXs = EdgeInsets.all(spaceXs);
  static const EdgeInsets paddingAllSm = EdgeInsets.all(spaceSm);
  static const EdgeInsets paddingAllMd = EdgeInsets.all(spaceMd);
  static const EdgeInsets paddingAllLg = EdgeInsets.all(spaceLg);
  static const EdgeInsets paddingHorizontalMd = EdgeInsets.symmetric(horizontal: spaceMd);
  static const EdgeInsets paddingVerticalSm = EdgeInsets.symmetric(vertical: spaceSm);

  // ==========================================
  // 3. Border Radius / Shapes (Material Design 3 Tokens)
  // ==========================================
  static const double radiusXs = 4.0;
  static const double radiusSm = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 24.0;
  static const double radiusXxl = 28.0;
  static const double radiusFull = 9999.0;

  // Shape borders
  static final BorderRadius borderXs = BorderRadius.circular(radiusXs);
  static final BorderRadius borderSm = BorderRadius.circular(radiusSm);
  static final BorderRadius borderMd = BorderRadius.circular(radiusMd);
  static final BorderRadius borderLg = BorderRadius.circular(radiusLg);
  static final BorderRadius borderXl = BorderRadius.circular(radiusXl);
  static final BorderRadius borderXxl = BorderRadius.circular(radiusXxl);
  static final BorderRadius borderFull = BorderRadius.circular(radiusFull);

  // Rounded Shapes for Widgets
  static final RoundedRectangleBorder shapeXs = RoundedRectangleBorder(borderRadius: borderXs);
  static final RoundedRectangleBorder shapeSm = RoundedRectangleBorder(borderRadius: borderSm);
  static final RoundedRectangleBorder shapeMd = RoundedRectangleBorder(borderRadius: borderMd);
  static final RoundedRectangleBorder shapeLg = RoundedRectangleBorder(borderRadius: borderLg);
  static final RoundedRectangleBorder shapeXl = RoundedRectangleBorder(borderRadius: borderXl);
  static final RoundedRectangleBorder shapeXxl = RoundedRectangleBorder(borderRadius: borderXxl);

  // ==========================================
  // 4. Elevation & Shadows
  // ==========================================
  static List<BoxShadow> get shadowLevel0 => [];
  
  static List<BoxShadow> get shadowLevel1 => [
    BoxShadow(
      color: Colors.black.withOpacity(0.04),
      blurRadius: 4,
      offset: const Offset(0, 2),
    )
  ];

  static List<BoxShadow> get shadowLevel2 => [
    BoxShadow(
      color: Colors.black.withOpacity(0.06),
      blurRadius: 8,
      offset: const Offset(0, 4),
    )
  ];

  static List<BoxShadow> get shadowLevel3 => [
    BoxShadow(
      color: Colors.black.withOpacity(0.08),
      blurRadius: 16,
      offset: const Offset(0, 8),
    ),
    BoxShadow(
      color: Colors.black.withOpacity(0.02),
      blurRadius: 2,
      offset: const Offset(0, 1),
    )
  ];

  // ==========================================
  // 5. Animations & Durations
  // ==========================================
  static const Duration durationShort = Duration(milliseconds: 150);
  static const Duration durationNormal = Duration(milliseconds: 250);
  static const Duration durationLong = Duration(milliseconds: 400);

  static const Curve curveStandard = Curves.easeInOutCubic;
  static const Curve curveDecelerate = Curves.easeOutCubic;
  static const Curve curveAccelerate = Curves.easeInCubic;

  // ==========================================
  // 6. Typography (MD3 Plus Jakarta Sans Inspired)
  // ==========================================
  static const String fontFamily = 'Plus Jakarta Sans';

  static TextTheme textTheme(Color color) {
    return TextTheme(
      // Display
      displayLarge: TextStyle(
        fontFamily: fontFamily,
        fontSize: 57,
        fontWeight: FontWeight.w800,
        letterSpacing: -1.0,
        color: color,
      ),
      displayMedium: TextStyle(
        fontFamily: fontFamily,
        fontSize: 45,
        fontWeight: FontWeight.w800,
        letterSpacing: -0.5,
        color: color,
      ),
      displaySmall: TextStyle(
        fontFamily: fontFamily,
        fontSize: 36,
        fontWeight: FontWeight.w700,
        color: color,
      ),
      
      // Headline
      headlineLarge: TextStyle(
        fontFamily: fontFamily,
        fontSize: 32,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.25,
        color: color,
      ),
      headlineMedium: TextStyle(
        fontFamily: fontFamily,
        fontSize: 28,
        fontWeight: FontWeight.w700,
        color: color,
      ),
      headlineSmall: TextStyle(
        fontFamily: fontFamily,
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: color,
      ),

      // Title
      titleLarge: TextStyle(
        fontFamily: fontFamily,
        fontSize: 22,
        fontWeight: FontWeight.w600,
        color: color,
      ),
      titleMedium: TextStyle(
        fontFamily: fontFamily,
        fontSize: 16,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.15,
        color: color,
      ),
      titleSmall: TextStyle(
        fontFamily: fontFamily,
        fontSize: 14,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.1,
        color: color,
      ),

      // Body
      bodyLarge: TextStyle(
        fontFamily: fontFamily,
        fontSize: 16,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.5,
        color: color,
      ),
      bodyMedium: TextStyle(
        fontFamily: fontFamily,
        fontSize: 14,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.25,
        color: color,
      ),
      bodySmall: TextStyle(
        fontFamily: fontFamily,
        fontSize: 12,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.4,
        color: color,
      ),

      // Label
      labelLarge: TextStyle(
        fontFamily: fontFamily,
        fontSize: 14,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.1,
        color: color,
      ),
      labelMedium: TextStyle(
        fontFamily: fontFamily,
        fontSize: 12,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.5,
        color: color,
      ),
      labelSmall: TextStyle(
        fontFamily: fontFamily,
        fontSize: 11,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.5,
        color: color,
      ),
    );
  }

  // ==========================================
  // 7. Complete ThemeData Construction
  // ==========================================
  static ThemeData buildTheme({required bool isDark}) {
    final Brightness brightness = isDark ? Brightness.dark : Brightness.light;
    
    final ColorScheme colorScheme = isDark
        ? const ColorScheme(
            brightness: Brightness.dark,
            primary: primaryDark,
            onPrimary: onPrimaryDark,
            primaryContainer: primaryContainerDark,
            onPrimaryContainer: onPrimaryContainerDark,
            secondary: secondaryDark,
            onSecondary: onSecondaryDark,
            secondaryContainer: secondaryContainerDark,
            onSecondaryContainer: onSecondaryContainerDark,
            tertiary: tertiaryDark,
            onTertiary: onTertiaryDark,
            tertiaryContainer: tertiaryContainerDark,
            onTertiaryContainer: onTertiaryContainerDark,
            error: errorDark,
            onError: onErrorDark,
            errorContainer: errorContainerDark,
            onErrorContainer: onErrorContainerDark,
            background: backgroundDark,
            onBackground: onBackgroundDark,
            surface: surfaceDark,
            onSurface: onSurfaceDark,
            surfaceVariant: surfaceVariantDark,
            onSurfaceVariant: onBackgroundDark,
            outline: outlineDark,
          )
        : const ColorScheme(
            brightness: Brightness.light,
            primary: primaryLight,
            onPrimary: onPrimaryLight,
            primaryContainer: primaryContainerLight,
            onPrimaryContainer: onPrimaryContainerLight,
            secondary: secondaryLight,
            onSecondary: onSecondaryLight,
            secondaryContainer: secondaryContainerLight,
            onSecondaryContainer: onSecondaryContainerLight,
            tertiary: tertiaryLight,
            onTertiary: onTertiaryLight,
            tertiaryContainer: tertiaryContainerLight,
            onTertiaryContainer: onTertiaryContainerLight,
            error: errorLight,
            onError: onErrorLight,
            errorContainer: errorContainerLight,
            onErrorContainer: onErrorContainerLight,
            background: backgroundLight,
            onBackground: onBackgroundLight,
            surface: surfaceLight,
            onSurface: onSurfaceLight,
            surfaceVariant: surfaceVariantLight,
            onSurfaceVariant: onBackgroundLight,
            outline: outlineLight,
          );

    final textThemeColor = isDark ? onBackgroundDark : onBackgroundLight;

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      fontFamily: fontFamily,
      textTheme: textTheme(textThemeColor),
      
      // Card Theme
      cardTheme: CardTheme(
        color: isDark ? surfaceDark : surfaceLight,
        elevation: isDark ? 0 : 1,
        shadowColor: Colors.black.withOpacity(0.08),
        shape: shapeLg,
        margin: EdgeInsets.zero,
      ),

      // Button Themes
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          elevation: isDark ? 0 : 2,
          backgroundColor: isDark ? primaryContainerDark : primaryLight,
          foregroundColor: isDark ? onPrimaryContainerDark : onPrimaryLight,
          padding: const EdgeInsets.symmetric(horizontal: spaceLg, vertical: spaceSm + 2),
          shape: shapeMd,
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
      ),

      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: isDark ? primaryDark : primaryLight,
          foregroundColor: isDark ? onPrimaryDark : onPrimaryLight,
          padding: const EdgeInsets.symmetric(horizontal: spaceLg, vertical: spaceSm + 2),
          shape: shapeMd,
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: isDark ? primaryDark : primaryLight,
          side: BorderSide(color: isDark ? outlineDark : outlineLight, width: 1.2),
          padding: const EdgeInsets.symmetric(horizontal: spaceLg, vertical: spaceSm + 2),
          shape: shapeMd,
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
      ),

      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: isDark ? primaryDark : primaryLight,
          padding: const EdgeInsets.symmetric(horizontal: spaceMd, vertical: spaceSm),
          shape: shapeSm,
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
      ),

      // AppBar Theme
      appBarTheme: AppBarTheme(
        backgroundColor: isDark ? backgroundDark : backgroundLight,
        elevation: 0,
        scrolledUnderElevation: 2.0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 20,
          fontWeight: FontWeight.w800,
          color: isDark ? onBackgroundDark : onBackgroundLight,
        ),
        iconTheme: IconThemeData(
          color: isDark ? onBackgroundDark : onBackgroundLight,
        ),
      ),

      // Chip Theme
      chipTheme: ChipThemeData(
        backgroundColor: isDark ? surfaceVariantDark : backgroundLight,
        side: BorderSide(color: isDark ? Colors.transparent : outlineLight.withOpacity(0.3)),
        shape: shapeSm,
        padding: const EdgeInsets.all(spaceXs),
        labelStyle: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: isDark ? onBackgroundDark : onBackgroundLight,
        ),
      ),
    );
  }
}
