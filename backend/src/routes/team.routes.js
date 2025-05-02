const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.middleware");
const teamController = require("../controllers/team.controller");

router.use(auth);

// Create a new team
router.post("/", teamController.createTeam);

// Add members to a team
router.post("/:id/members", teamController.addTeamMembers);

// Get team by ID
router.get("/:id", teamController.getTeam);

// Update team info
router.put("/:id", teamController.updateTeam);

// Delete (disband) a team
router.delete("/:id", teamController.disbandTeam);

// Remove a team member
router.delete("/:teamId/members/:userId", teamController.removeTeamMember);

// Get teams where user is captain or member
router.get("/user/my-teams", teamController.getMyTeams);

// Register team for a tournament
router.post(
  "/:teamId/tournaments/:tournamentId",
  teamController.joinTournamentAsTeam
);

module.exports = router;
