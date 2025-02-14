() => 3;
() => { 3; };
() => { return 3; };


function makeClosure(init) {
  let closureValue = init;
  return () => `closure ${++closureValue}`;
}

const closure = makeClosure(0);
console.log(closure());
console.log(closure());

