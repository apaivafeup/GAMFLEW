using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Game : MonoBehaviour
{
    // Start is called before the first frame update

    void Start()
    {
        int code = 1;

        switch (code)
        {
            default:
                gameObject.AddComponent<CheckersBoard>();
                break;
            case 1:
                gameObject.AddComponent<ChallengeBoard>();
                break;
        }
    }
}
