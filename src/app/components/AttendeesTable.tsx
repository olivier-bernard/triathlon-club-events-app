interface Attendee {
  name: string;
  tour: string;
  groupLevel: string;
}

interface AttendeesTableProps {
  attendeesList: string[];
  onDelete?: (attendee: Attendee) => void;
}

export default function AttendeesTable({ attendeesList, onDelete }: AttendeesTableProps) {

  const attendees: (Attendee & { originalIdx: number })[] = (attendeesList || [])
    .map((entry, originalIdx) => {
      try {
        return { ...JSON.parse(entry), originalIdx };
      } catch {
        return { name: entry, tour: "", groupLevel: "", originalIdx };
      }
    })
    .sort((a, b) => {
      // Primary sort: Compare by groupLevel.
      const groupCompare = a.groupLevel.localeCompare(b.groupLevel);
      if (groupCompare !== 0) {
        return groupCompare;
      }
      // Secondary sort: If groupLevels are the same, compare by tour.
      const numA = parseInt(a.tour, 10) || 0;
      const numB = parseInt(b.tour, 10) || 0;
      return numB - numA; // Descending order  
    });

  return (
    <div className="mt-8 w-full md:w-4/5 mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-center">Participants</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra md:table-lg rounded-box bg-base-200 shadow-md w-full">
          <thead>
            <tr>
              <th className="text-base font-semibold py-0">Nom</th>
              <th className="text-base font-semibold text-center py-0">Groupe</th>
              <th className="text-base font-semibold text-center py-0">Tour</th>
              <th className="text-base font-semibold text-center py-0"> </th>
            </tr>
          </thead>
          <tbody>
            {attendees.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-1">Aucun participant pour le moment.</td>
              </tr>
            )}
            {attendees.map((att, idx) => (
              <tr key={idx}>
                <td className="font-medium py-1">{att.name}</td>
                <td className="text-center py-1">
                  <span className="badge badge-info badge-outline">{att.groupLevel}</span>
                </td>
                <td className="text-center py-1">
                  <span className="badge badge-success badge-outline">{att.tour}</span>
                </td>
                <td className="text-center py-1">
                  {onDelete && (
                    <button
                      type="button"
                      className="text-error hover:text-red-700 text-lg px-1"
                      title="Supprimer"
                      onClick={() => onDelete(att.originalIdx)}
                    >
                      &#10060;
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}