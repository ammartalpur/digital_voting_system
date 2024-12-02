#include <emscripten/bind.h>
#include <emscripten/emscripten.h>
#include <string>
#include <vector>

using namespace emscripten;

// Candidate structure
struct Candidate
{
  int id;
  std::string name;
  int votes;
};

std::vector<Candidate> candidates;

bool addCandidate(const std::string &name, int id)
{
  if (name.empty() || id < 0)
  {
    return false;
  }

  for (const auto &candidate : candidates)
  {
    if (candidate.id == id)
    {
      return false;
    }
  }

  // Create and add new candidate
  Candidate newCandidate{id, name, 0};
  candidates.push_back(newCandidate);
  return true;
}

bool deleteCandidate(int id)
{
  auto it = std::remove_if(candidates.begin(), candidates.end(),
                           [id](const Candidate &c)
                           { return c.id == id; });

  if (it != candidates.end())
  {
    candidates.erase(it, candidates.end());
    return true;
  }
  return false;
}

EMSCRIPTEN_BINDINGS(module)
{
  value_object<Candidate>("Candidate")
      .field("id", &Candidate::id)
      .field("name", &Candidate::name)
      .field("votes", &Candidate::votes);

  register_vector<Candidate>("vector<Candidate>");

  function("addCandidate", &addCandidate);
  function("deleteCandidate", &deleteCandidate);
}
