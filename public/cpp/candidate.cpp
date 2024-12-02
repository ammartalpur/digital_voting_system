#include <emscripten.h>
#include <emscripten/bind.h>
#include <vector>
#include <string>
#include <algorithm>

using namespace emscripten;
using namespace std;

struct Candidate
{
  int id;
  string name;
  int totalVotes;
};

vector<Candidate> candidates;
int candidateId = 0;

void resetCandidateId()
{
  candidateId = 0;
  emscripten_run_script("localStorage.setItem('candidateId', 0);");
}

void addCandidate(string name)
{
  if (name.empty())
    return;

  Candidate candidate = {candidateId, name, 0};
  candidates.push_back(candidate);
  candidateId++;
  emscripten_run_script(("localStorage.setItem('candidateId', " + to_string(candidateId) + ");").c_str());
}

void deleteCandidate(int id)
{
  auto it = remove_if(candidates.begin(), candidates.end(), [id](Candidate &candidate)
                      { return candidate.id == id; });
  candidates.erase(it, candidates.end());
}

Candidate getCandidateById(int candidateId)
{
  auto it = find_if(candidates.begin(), candidates.end(), [candidateId](Candidate &candidate)
                    { return candidate.id == candidateId; });
  if (it != candidates.end())
  {
    return *it;
  }
  return {-1, "", 0};
}

void incrementVote(int candidateId)
{
  auto it = find_if(candidates.begin(), candidates.end(), [candidateId](Candidate &candidate)
                    { return candidate.id == candidateId; });
  if (it != candidates.end())
  {
    it->totalVotes++;
  }
}

vector<Candidate> getCandidates()
{
  return candidates;
}

EMSCRIPTEN_BINDINGS(my_module)
{
  value_object<Candidate>("Candidate")
      .field("id", &Candidate::id)
      .field("name", &Candidate::name)
      .field("totalVotes", &Candidate::totalVotes);

  register_vector<Candidate>("vector<Candidate>");

  emscripten::function("resetCandidateId", &resetCandidateId);
  emscripten::function("addCandidate", &addCandidate);
  emscripten::function("deleteCandidate", &deleteCandidate);
  emscripten::function("getCandidateById", &getCandidateById);
  emscripten::function("incrementVote", &incrementVote);
  emscripten::function("getCandidates", &getCandidates);
}