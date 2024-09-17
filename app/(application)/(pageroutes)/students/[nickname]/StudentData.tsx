import { Card } from "@/components/ui/card";

interface StudentDataProps {
  name: string;
  nickname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

function StudentData({ student }: { student: StudentDataProps }) {
  return (
    <Card className="p-2">
      <h2 className="text-xl font-semibold">Student Details:</h2>
      <div className="grid grid-cols-2">
        <div>
          <p>
            <strong>Name:</strong> {student.name}
          </p>
          <p>
            <strong>Nickname:</strong> {student.nickname}
          </p>
        </div>

        <div>
          <p>
            <strong>Role: </strong>
            {student.role.charAt(0) + student.role.slice(1).toLowerCase()}
          </p>
          <p>
            <strong>Email:</strong> {student.email}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default StudentData;
