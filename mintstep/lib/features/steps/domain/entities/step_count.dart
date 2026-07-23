import 'package:equatable/equatable.dart';

class StepCount extends Equatable {
  final String id;
  final int count;
  final DateTime date;
  final double caloriesBurned;
  final double distanceKm;
  final bool isSynced;

  const StepCount({
    required this.id,
    required this.count,
    required this.date,
    required this.caloriesBurned,
    required this.distanceKm,
    this.isSynced = false,
  });

  @override
  List<Object?> get props => [id, count, date, caloriesBurned, distanceKm, isSynced];
}
