"use server"

import { auth } from "@clerk/nextjs/server"

const {userId} = auth()

// Is the current user...?

// member of class (classId)

// member of class of assessment (assessmentId)

// teacher of class (classId)

// teacher of class of assessment (assessmentId)

// teacher of class of issue (issueId)

// teacher of class of student (studentNickname)
