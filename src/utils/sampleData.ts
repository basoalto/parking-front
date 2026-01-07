// Supabase imports and usage removed. Replace with backend or local state logic as needed.

export async function createSampleData(userId: string) {
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

  // Replace the following lines with your data creation logic
  console.log('Sample data would be created with the following details:');
  console.log('User ID:', userId);
  console.log('Parking Lot:', {
    name: 'Downtown Speed Garage',
    address: '777 Racing Boulevard, Downtown',
    hourly_rate: 8.50,
    capacity: 50,
  });
  console.log('Vehicle Entries:', [
    {
      license_plate: 'NFS-2024',
      vehicle_type: 'car',
      entry_time: twoHoursAgo.toISOString(),
    },
    {
      license_plate: 'SPD-777',
      vehicle_type: 'suv',
      entry_time: fourHoursAgo.toISOString(),
    },
  ]);

  console.log('Sample data created successfully!');
}
